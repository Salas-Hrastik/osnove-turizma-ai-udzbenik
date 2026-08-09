const MAX_QUESTION = 700
const MAX_CONTEXT = 28000
const DEFAULT_MODEL = 'claude-haiku-4-5'
const ROUTE_VERSION = '2026-08-09.1'

function deploymentInfo() {
  return {
    branch: process.env.VERCEL_GIT_COMMIT_REF || null,
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || null,
  }
}

function upstreamError(status, payload) {
  const detail = payload?.error?.message
  if (status === 401) return 'Anthropic API ključ nije valjan.'
  if (status === 403) return 'Anthropic API ključ nema pristup odabranom modelu.'
  if (status === 404) return 'Odabrani Anthropic model nije dostupan.'
  if (status === 429) return 'Dosegnuto je trenutačno ograničenje Anthropic API-ja. Pokušajte ponovno za nekoliko trenutaka.'
  return detail || 'AI usluga nije vratila odgovor.'
}

function plainText(value) {
  return String(value || '')
    .replace(/\r\n?/g, '\n')
    .replace(/^\s*```[^\n]*\n?/gm, '')
    .replace(/^\s{0,3}#{1,6}\s*/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/_([^_\n]+)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export default async function handler(request, response) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL

  if (request.method === 'GET') {
    return response.status(200).json({
      status: 'ok',
      configured: Boolean(apiKey),
      model,
      routeVersion: ROUTE_VERSION,
      deployment: deploymentInfo(),
    })
  }
  if (request.method !== 'POST') {
    response.setHeader('allow', 'GET, POST')
    return response.status(405).json({ error: 'Dopušteni su GET i POST zahtjevi.' })
  }
  if (!apiKey) return response.status(503).json({ error: 'AI razgovor još nije konfiguriran na poslužitelju.' })

  let body = request.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return response.status(400).json({ error: 'Tijelo zahtjeva nije ispravan JSON.' })
    }
  }

  const question = String(body?.question || '').trim().slice(0, MAX_QUESTION)
  const context = String(body?.context || '').slice(0, MAX_CONTEXT)
  const history = Array.isArray(body?.history) ? body.history.slice(-6) : []
  if (!question || !context) return response.status(400).json({ error: 'Nedostaje pitanje ili kontekst udžbenika.' })

  const messages = history
    .filter((item) => item && (item.role === 'user' || item.role === 'assistant'))
    .map((item) => ({ role: item.role, content: String(item.text || '').slice(0, 1800) }))
  messages.push({ role: 'user', content: `PITANJE:\n${question}\n\nDOPUŠTENI IZVORI:\n${context}` })

  try {
    const anthropic = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      signal: AbortSignal.timeout(30000),
      body: JSON.stringify({
        model,
        max_tokens: 900,
        temperature: 0.2,
        system: `Ti si stručni AI vodič hrvatskog sveučilišnog udžbenika „Osnove turizma i ugostiteljstva”. Odgovaraj prirodnim, jasnim hrvatskim jezikom. Odgovor temelji isključivo na DOPUŠTENIM IZVORIMA iz posljednje korisničke poruke i relevantnoj kratkoj povijesti. Ne izmišljaj činjenice. Razlikuj kanonski tekst od uredničkog ili istraživačkog dodatka. Ako izvori nisu dovoljni, to izričito reci i predloži preciznije pitanje ili širi unutarnji opseg. Ne pretražuj vanjske izvore. Odgovori u 2–5 kratkih odlomaka. Piši kao običan tekst: bez Markdowna, bez zvjezdica, bez ljestvi, bez popisa i bez naslova. Na kraju dodaj zaseban redak "Izvor: ..." s najrelevantnijom oznakom izvora iz konteksta.`,
        messages,
      }),
    })
    const payload = await anthropic.json()
    if (!anthropic.ok) {
      const error = new Error(upstreamError(anthropic.status, payload))
      error.upstreamStatus = anthropic.status
      throw error
    }
    const text = payload?.content?.filter((part) => part.type === 'text').map((part) => part.text).join('\n').trim()
    if (!text) throw new Error('AI usluga vratila je prazan odgovor.')
    const sourceMatch = text.match(/\n?Izvor:\s*(.+)$/i)
    return response.status(200).json({
      text: plainText(sourceMatch ? text.slice(0, sourceMatch.index) : text),
      source: plainText(sourceMatch?.[1]) || 'AI odgovor utemeljen na odabranom opsegu udžbenika',
    })
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'TimeoutError'
    const message = timedOut
      ? 'AI usluga nije odgovorila unutar 30 sekundi.'
      : error instanceof Error ? error.message : 'AI razgovor trenutačno nije dostupan.'
    console.error('Anthropic chat request failed', {
      model,
      upstreamStatus: error?.upstreamStatus || null,
      message,
      deployment: deploymentInfo(),
    })
    return response.status(502).json({ error: message })
  }
}
