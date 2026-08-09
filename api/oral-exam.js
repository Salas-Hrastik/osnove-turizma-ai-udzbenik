const DEFAULT_MODEL = 'claude-haiku-4-5'
const MAX_ANSWER = 7000
const MAX_RECORDS = 5

function parseBody(request) {
  if (typeof request.body !== 'string') return request.body
  try {
    return JSON.parse(request.body)
  } catch {
    return null
  }
}

function text(value, limit = 3000) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, limit)
}

function parseJson(value) {
  const cleaned = String(value || '').replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start < 0 || end <= start) throw new Error('AI vrednovanje nije vratilo valjan zapis.')
  return JSON.parse(cleaned.slice(start, end + 1))
}

function clampScore(value) {
  return Math.max(0, Math.min(20, Math.round(Number(value) || 0)))
}

async function callAnthropic(apiKey, model, system, prompt, maxTokens) {
  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    signal: AbortSignal.timeout(30000),
    body: JSON.stringify({ model, max_tokens: maxTokens, temperature: 0, system, messages: [{ role: 'user', content: prompt }] }),
  })
  const payload = await upstream.json()
  if (!upstream.ok) throw new Error(payload?.error?.message || `AI vrednovanje nije dostupno (${upstream.status}).`)
  return payload?.content?.filter((part) => part.type === 'text').map((part) => part.text).join('\n').trim()
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('allow', 'POST')
    return response.status(405).json({ error: 'Dopušten je samo POST zahtjev.' })
  }
  const apiKey = process.env.ANTHROPIC_API_KEY
  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL
  const body = parseBody(request)
  if (!body) return response.status(400).json({ error: 'Tijelo zahtjeva nije ispravan JSON.' })

  if (body.mode === 'answer') {
    const question = text(body.question, 1200)
    const answer = text(body.answer, MAX_ANSWER)
    const expectedAnswer = text(body.expectedAnswer, 2400)
    if (!question || !answer || !expectedAnswer) return response.status(400).json({ error: 'Nedostaje pitanje, odgovor ili očekivana osnova.' })
    if (!apiKey) return response.status(503).json({ error: 'AI vrednovanje završnoga razgovora nije konfigurirano.' })
    try {
      const result = await callAnthropic(apiKey, model,
        'Ti si strogi, ali poticajan sveučilišni ispitivač. Vrednuješ samo studentov odgovor prema dostavljenoj očekivanoj osnovi. Ne dodaješ vanjske činjenice. Vraćaš isključivo valjan JSON bez Markdowna.',
        `Pitanje iz cjeline ${text(body.chapterId, 10)} „${text(body.chapterTitle, 240)}”: ${question}\nOčekivana osnova: ${expectedAnswer}\nStudentov odgovor: ${answer}\nSugestivna pomoć već korištena: ${body.hintUsed === true ? 'da' : 'ne'}\nProcijeni točnost, obuhvat, povezivanje pojmova i jasnoću. Ocjena score mora biti cijeli broj 0–20. complete je true samo ako je odgovor dovoljno sadržajan da ga se može konačno vrednovati; ako je provisional true i odgovor je bitno nedovršen, postavi complete false i oblikuj jednu kratku sugestivnu pomoć koja usmjerava, ali ne otkriva cijeli odgovor. Vrati JSON: {"score":number,"complete":boolean,"level":"kratka razina","strengths":"jedna do dvije rečenice","omissions":"jedna do dvije rečenice","feedback":"kratko usmeno obrazloženje studentu","hint":"jedna sugestivna rečenica"}.`,
        700)
      const parsed = parseJson(result)
      return response.status(200).json({
        score: clampScore(parsed.score),
        complete: parsed.complete === true,
        level: text(parsed.level, 80),
        strengths: text(parsed.strengths, 700),
        omissions: text(parsed.omissions, 700),
        feedback: text(parsed.feedback, 700),
        hint: text(parsed.hint, 500),
      })
    } catch (error) {
      console.error('Oral exam answer evaluation failed', { model, message: error instanceof Error ? error.message : 'unknown' })
      return response.status(502).json({ error: 'Odgovor trenutačno nije moguće pouzdano vrednovati. Zapis nije izgubljen; pokušajte završiti odgovor ponovno.' })
    }
  }

  if (body.mode === 'final') {
    const records = Array.isArray(body.records) ? body.records.slice(0, MAX_RECORDS) : []
    if (records.length !== MAX_RECORDS) return response.status(400).json({ error: 'Za završni sud potrebno je pet odgovora.' })
    const fallback = {
      summary: `Ukupni rezultat iznosi ${Math.max(0, Math.min(100, Number(body.total) || 0))} od 100 bodova na pet nasumično odabranih pitanja.`,
      strengths: records.map((record) => text(record?.evaluation?.strengths, 250)).filter(Boolean).join(' '),
      recommendations: records.map((record) => text(record?.evaluation?.omissions, 250)).filter(Boolean).join(' '),
    }
    if (!apiKey) return response.status(200).json(fallback)
    try {
      const compactRecords = records.map((record, index) => ({
        pitanje: index + 1,
        cjelina: record?.question?.chapterId,
        bodovi: clampScore(record?.evaluation?.score),
        snage: text(record?.evaluation?.strengths, 350),
        praznine: text(record?.evaluation?.omissions, 350),
      }))
      const result = await callAnthropic(apiKey, model,
        'Ti si sveučilišni ispitivač koji sažima već provedena pojedinačna vrednovanja. Ne mijenjaš bodove ni predloženu ocjenu. Pišeš sažeto, razvojno i na hrvatskom. Vraćaš isključivo valjan JSON bez Markdowna.',
        `Ukupno bodova: ${text(body.total, 10)}/100. Algoritamski prijedlog ocjene: ${text(body.grade, 5)}. Pojedinačni nalazi: ${JSON.stringify(compactRecords)}. Vrati JSON {"summary":"dvije do tri rečenice o razini usvojenosti i povezivanja znanja","strengths":"sažeta sinteza najjačih strana","recommendations":"konkretna područja za ponavljanje"}.`,
        700)
      const parsed = parseJson(result)
      return response.status(200).json({ summary: text(parsed.summary, 1000), strengths: text(parsed.strengths, 900), recommendations: text(parsed.recommendations, 900) })
    } catch (error) {
      console.error('Oral exam final synthesis failed', { model, message: error instanceof Error ? error.message : 'unknown' })
      return response.status(200).json(fallback)
    }
  }

  return response.status(400).json({ error: 'Nepoznat način vrednovanja.' })
}
