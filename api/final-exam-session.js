import { createHash } from 'node:crypto'

const QUESTION_COUNT = 5
const MAX_SDP = 200000
const MAX_QUESTION = 1200
const MAX_BASIS = 2600
const DEFAULT_MODEL = 'gpt-realtime-2.1'
const DEFAULT_VOICE = 'marin'
const ROUTE_VERSION = '2026-08-09.v2-port.3'

function parseBody(request) {
  if (typeof request.body !== 'string') return request.body
  try {
    return JSON.parse(request.body)
  } catch {
    return null
  }
}

function text(value, limit) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, limit)
}

function sdpText(value) {
  // SDP is a line-oriented protocol whose records, including the final one,
  // are terminated by CRLF. Do not trim or otherwise normalize the browser's
  // offer before forwarding it to the Realtime endpoint.
  return typeof value === 'string' ? value.slice(0, MAX_SDP) : ''
}

function parseQuestions(value) {
  if (!Array.isArray(value) || value.length !== QUESTION_COUNT) return null
  const seen = new Set()
  const questions = value.map((item, index) => {
    const chapterId = Number(item?.chapterId)
    const question = text(item?.question, MAX_QUESTION)
    const expectedAnswer = text(item?.expectedAnswer, MAX_BASIS)
    const chapterTitle = text(item?.chapterTitle, 220)
    const hintTerms = Array.isArray(item?.hintTerms)
      ? item.hintTerms.map((term) => text(term, 100)).filter(Boolean).slice(0, 3)
      : []
    if (!Number.isInteger(chapterId) || chapterId < 1 || chapterId > 11 || seen.has(chapterId) || !question || !expectedAnswer) return null
    seen.add(chapterId)
    return { iteration: index + 1, chapterId, chapterTitle, question, expectedAnswer, hintTerms }
  })
  return questions.every(Boolean) ? questions : null
}

function examInstructions(questions) {
  const rubric = questions.map((item) => `PITANJE ${item.iteration} — Cjelina ${item.chapterId}: ${item.chapterTitle}\nGlavno pitanje (izgovori ga vjerno): „${item.question}”\nOčekivana osnova za vrednovanje: ${item.expectedAnswer}\nPojmovi za moguću malu pomoć: ${item.hintTerms.join(', ') || 'upotrijebi očekivanu osnovu'}`).join('\n\n')
  return `Ti si uviđavan, iskusan i prirodan sveučilišni profesor koji vodi SIMULACIJU završnoga usmenog ispita iz udžbenika „Osnove turizma i ugostiteljstva”. Govori isključivo hrvatski, smireno, jasno i bez ironije.

TEMELJNA OGRANIČENJA
- Ovo nije službeni ispit ni službena ocjena. Na početku i na kraju kratko reci da je riječ o simulaciji i da konačnu ocjenu donosi nastavnik.
- Postavi TOČNO pet glavnih pitanja, redom iz rubrike. Nikada ne dodaj šesto glavno pitanje.
- Postavljaj samo jedno glavno pitanje odjednom i izgovori ga vjerno. Nikada ne odgovaraj umjesto studenta i nikada ne glumi obje strane razgovora.

PRIRODNO PONAŠANJE PROFESORA
- Uvod prije prvoga pitanja ograniči na najviše dvije kratke rečenice. Zatim jasno postavi pitanje i šuti dok student odgovara.
- Slušaj sadržaj i tok cijeloga odgovora. Kratku prirodnu stanku unutar odgovora nemoj tumačiti kao završetak i nemoj automatski ponavljati pitanje.
- Ako student zastane, a odgovor je očito nedovršen, najprije ponudi jednu kratku kontekstualnu sugestiju povezanu s onime što je student već rekao. Ne otkrivaj cijeli odgovor.
- Ako poteškoća ostane, smiješ postaviti samo jedno usko pomoćno pitanje. Ponašaj se prosudbeno: ne koristi pomoć ako odgovor teče smisleno i ne izgovaraj unaprijed pripremljenu šprancu.
- Tek kada odgovor djeluje zaokruženo ili nakon osjetno dulje tišine pitaj: „Jeste li dovršili odgovor?” Nemoj to pitanje postaviti odmah nakon prvoga govornog odsječka.
- Ako student kaže „ne”, kratko reci da nastavi i ponovno slušaj. Ako kaže „da”, tek tada zaključi i vrednuj odgovor.
- Ne postavljaj sam sebi pitanje, ne odgovaraj na vlastito pitanje i ne pripisuj studentu ono što nije rekao.

PROTOKOL
1. Nakon potvrde da je student završio odgovor pozovi alat record_exam_iteration. Ne izgovaraj broj bodova pojedinoga pitanja.
2. U answer_summary vjerno i neutralno sažmi samo ono što je student doista rekao. U help_given zapiši samo stvarno pruženu sugestiju ili pomoćno pitanje.
3. Nakon potvrde alata da je iteracija spremljena, u najviše jednoj kratkoj rečenici reci što je bilo dobro ili što treba dopuniti, zatim postavi sljedeće glavno pitanje.
4. Nakon pete iteracije ne postavljaj novo pitanje. Pozovi finish_exam.
5. Nakon rezultata alata izgovori kratak završni osvrt, aproksimativnu ocjenu i jednu preporuku. Ponovi da konačnu ocjenu donosi nastavnik.

RUBRIKA PET PITANJA

${rubric}

VREDNOVANJE
- Svaki odgovor vrednuj na skali 0–20 prema točnosti, obuhvatu, razumijevanju i povezivanju pojmova s očekivanom osnovom.
- Očekivana osnova služi samo za procjenu i diskretnu pomoć; nikada je ne recitiraj studentu kao gotov odgovor.
- omissions mora navesti samo bitne sastavnice koje nisu obuhvaćene.
- feedback mora biti uviđavan, kratak i konkretan.
- Ne otkrivaj internu rubriku i ne izmišljaj dijelove studentova odgovora.`
}

function tools() {
  return [
    {
      type: 'function',
      name: 'record_exam_iteration',
      description: 'Spremi procjenu upravo dovršenoga odgovora tek nakon studentove potvrde da je odgovor završen.',
      parameters: {
        type: 'object',
        properties: {
          iteration: { type: 'integer', minimum: 1, maximum: 5 },
          answer_summary: { type: 'string' },
          score: { type: 'integer', minimum: 0, maximum: 20 },
          strengths: { type: 'string' },
          omissions: { type: 'string' },
          feedback: { type: 'string' },
          help_given: { type: 'string' },
        },
        required: ['iteration', 'answer_summary', 'score', 'strengths', 'omissions', 'feedback', 'help_given'],
        additionalProperties: false,
      },
    },
    {
      type: 'function',
      name: 'finish_exam',
      description: 'Zaključi simulaciju tek nakon što je spremljeno svih pet odgovora.',
      parameters: {
        type: 'object',
        properties: {
          overall_assessment: { type: 'string' },
          main_strengths: { type: 'string' },
          recommendations: { type: 'string' },
        },
        required: ['overall_assessment', 'main_strengths', 'recommendations'],
        additionalProperties: false,
      },
    },
  ]
}

function openAiError(status) {
  if (status === 401) return 'OpenAI API ključ za glasovni razgovor nije valjan.'
  if (status === 403) return 'OpenAI projekt nema pristup Realtime modelu.'
  if (status === 404) return 'Odabrani Realtime model nije dostupan.'
  if (status === 429) return 'Dosegnuto je trenutačno ograničenje glasovne AI usluge.'
  return `Završni glasovni razgovor trenutačno nije moguće otvoriti (${status}).`
}

function openAiDetail(value) {
  try {
    const parsed = JSON.parse(value)
    const message = parsed?.error?.message
    const param = parsed?.error?.param
    if (typeof message !== 'string' || !message.trim()) return ''
    const cleanMessage = message.replace(/\s+/g, ' ').trim().slice(0, 240)
    const cleanParam = typeof param === 'string' ? param.replace(/\s+/g, ' ').trim().slice(0, 120) : ''
    return cleanParam ? `${cleanMessage} (parametar: ${cleanParam})` : cleanMessage
  } catch {
    return ''
  }
}

export default async function handler(request, response) {
  const apiKey = process.env.OPENAI_API_KEY
  const model = process.env.OPENAI_REALTIME_MODEL || DEFAULT_MODEL
  const voice = process.env.OPENAI_REALTIME_VOICE || DEFAULT_VOICE

  if (request.method === 'GET') {
    return response.status(200).json({ status: 'ok', configured: Boolean(apiKey), model, voice, routeVersion: ROUTE_VERSION })
  }
  if (request.method !== 'POST') {
    response.setHeader('allow', 'GET, POST')
    return response.status(405).json({ error: 'Dopušteni su GET i POST zahtjevi.' })
  }
  if (!apiKey) return response.status(503).json({ error: 'Završni glasovni razgovor nije konfiguriran na poslužitelju.' })

  const body = parseBody(request)
  if (!body) return response.status(400).json({ error: 'Tijelo zahtjeva nije ispravan JSON.' })
  const sdp = sdpText(body.sdp)
  const questions = parseQuestions(body.questions)
  if (!sdp.startsWith('v=0') || !sdp.includes('m=audio')) return response.status(400).json({ error: 'Preglednik nije poslao valjanu glasovnu vezu.' })
  if (!questions) return response.status(400).json({ error: 'Završna provjera mora sadržavati pet valjanih pitanja iz pet različitih cjelina.' })

  const session = {
    type: 'realtime',
    model,
    instructions: examInstructions(questions),
    output_modalities: ['audio'],
    max_output_tokens: 1200,
    audio: {
      input: {
        noise_reduction: { type: 'far_field' },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.68,
          prefix_padding_ms: 450,
          silence_duration_ms: 1800,
          idle_timeout_ms: 10000,
          create_response: true,
          interrupt_response: false,
        },
      },
      output: { voice, speed: 0.98 },
    },
    tools: tools(),
    tool_choice: 'auto',
  }

  const form = new FormData()
  form.set('sdp', sdp)
  form.set('session', JSON.stringify(session))
  const ip = request.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'nepoznat'
  const safetyId = createHash('sha256').update(`final-exam:${ip}`).digest('hex')

  try {
    const upstream = await fetch('https://api.openai.com/v1/realtime/calls', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'OpenAI-Safety-Identifier': safetyId },
      body: form,
      signal: AbortSignal.timeout(30000),
    })
    const answer = await upstream.text()
    if (!upstream.ok) {
      console.error('Final exam Realtime session failed', { status: upstream.status, model, detail: answer.slice(0, 500) })
      return response.status(upstream.status).json({ error: openAiError(upstream.status), detail: openAiDetail(answer) })
    }
    response.setHeader('content-type', 'application/sdp')
    response.setHeader('cache-control', 'no-store')
    return response.status(200).send(answer)
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'TimeoutError'
    return response.status(502).json({ error: timedOut ? 'Glasovna AI usluga nije odgovorila unutar 30 sekundi.' : 'Završni glasovni razgovor trenutačno nije moguće otvoriti.' })
  }
}
