const MAX_CONTEXT = 60000
const MAX_SDP = 200000
const DEFAULT_MODEL = 'gpt-realtime-2.1'
const DEFAULT_VOICE = 'marin'
const ROUTE_VERSION = '2026-08-09.1'

function deploymentInfo() {
  return {
    branch: process.env.VERCEL_GIT_COMMIT_REF || null,
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || null,
  }
}

function parseBody(request) {
  if (typeof request.body !== 'string') return request.body
  try {
    return JSON.parse(request.body)
  } catch {
    return null
  }
}

function sessionInstructions(context, scopeLabel) {
  return `Ti si glasovni AI vodič hrvatskog sveučilišnog udžbenika „Osnove turizma i ugostiteljstva”.
Govori isključivo hrvatski, prirodno, smireno i razgovorno, kao iskusan sveučilišni nastavnik u živom dijalogu.
Odgovori odmah na pitanje, najčešće u 2 do 4 kratke i cjelovite rečenice prikladne za slušanje.
Nemoj čitati naslove, oznake, zvjezdice, popise ni tehničke podatke. Nemoj stvarati transkript niti ga spominjati.
Razgovor je dvosmjeran: nakon odgovora prepusti riječ korisniku. Ako korisnik progovori dok govoriš, odmah prestani i poslušaj novi govorni potez.
Odgovor temelji isključivo na dopuštenim izvorima u nastavku. Ne koristi opće znanje i ne izmišljaj.
Razlikuj kanonski tekst od uredničkog ili istraživačkog dodatka. Ako izvori nisu dovoljni, to kratko i jasno reci.
Izvor spomeni samo kada je koristan za vjerodostojnost ili kada ga korisnik zatraži.
Ne govori o API-ju, modelu, kontekstu ni tehničkoj pozadini.

ODABRANI OPSEG: ${scopeLabel}

DOPUŠTENI IZVORI:
${context}`
}

function openAiError(status) {
  if (status === 401) return 'OpenAI API ključ za glasovni razgovor nije valjan.'
  if (status === 403) return 'OpenAI projekt nema pristup Realtime modelu.'
  if (status === 404) return 'Odabrani Realtime model nije dostupan.'
  if (status === 429) return 'Dosegnuto je trenutačno ograničenje glasovne AI usluge.'
  return `Glasovnu sesiju trenutačno nije moguće otvoriti (${status}).`
}

export default async function handler(request, response) {
  const apiKey = process.env.OPENAI_API_KEY
  const model = process.env.OPENAI_REALTIME_MODEL || DEFAULT_MODEL
  const voice = process.env.OPENAI_REALTIME_VOICE || DEFAULT_VOICE

  if (request.method === 'GET') {
    return response.status(200).json({
      status: 'ok',
      configured: Boolean(apiKey),
      model,
      voice,
      routeVersion: ROUTE_VERSION,
      deployment: deploymentInfo(),
    })
  }
  if (request.method !== 'POST') {
    response.setHeader('allow', 'GET, POST')
    return response.status(405).json({ error: 'Dopušteni su GET i POST zahtjevi.' })
  }
  if (!apiKey) {
    return response.status(503).json({ error: 'Prirodni glasovni razgovor još nije konfiguriran na poslužitelju.' })
  }

  const body = parseBody(request)
  if (!body) return response.status(400).json({ error: 'Tijelo zahtjeva nije ispravan JSON.' })

  const sdp = String(body.sdp || '').slice(0, MAX_SDP)
  const context = String(body.context || '').slice(0, MAX_CONTEXT)
  const scopeLabel = String(body.scopeLabel || 'Odabrani dio udžbenika').slice(0, 160)
  if (!sdp.startsWith('v=0') || !sdp.includes('m=audio')) {
    return response.status(400).json({ error: 'Preglednik nije poslao valjanu glasovnu vezu.' })
  }
  if (!context.trim()) return response.status(400).json({ error: 'Nedostaje odabrani izvor udžbenika.' })

  const session = {
    type: 'realtime',
    model,
    instructions: sessionInstructions(context, scopeLabel),
    output_modalities: ['audio'],
    max_output_tokens: 420,
    audio: {
      input: {
        turn_detection: {
          type: 'semantic_vad',
          eagerness: 'high',
          create_response: true,
          interrupt_response: true,
        },
      },
      output: { voice, speed: 1 },
    },
  }

  const form = new FormData()
  form.set('sdp', sdp)
  form.set('session', JSON.stringify(session))

  try {
    const upstream = await fetch('https://api.openai.com/v1/realtime/calls', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
      signal: AbortSignal.timeout(30000),
    })
    const answer = await upstream.text()
    if (!upstream.ok) {
      console.error('OpenAI Realtime session failed', {
        status: upstream.status,
        model,
        deployment: deploymentInfo(),
        detail: answer.slice(0, 500),
      })
      return response.status(upstream.status).json({ error: openAiError(upstream.status) })
    }

    response.setHeader('content-type', 'application/sdp')
    response.setHeader('cache-control', 'no-store')
    return response.status(200).send(answer)
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'TimeoutError'
    const message = timedOut
      ? 'Glasovna AI usluga nije odgovorila unutar 30 sekundi.'
      : 'Glasovnu sesiju trenutačno nije moguće otvoriti.'
    console.error('OpenAI Realtime connection failed', { message, model, deployment: deploymentInfo() })
    return response.status(502).json({ error: message })
  }
}
