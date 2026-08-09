const MAX_QUESTION = 700
const MAX_CONTEXT = 28000

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Dopušten je samo POST zahtjev.' })
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return response.status(503).json({ error: 'AI razgovor još nije konfiguriran na poslužitelju.' })

  const question = String(request.body?.question || '').trim().slice(0, MAX_QUESTION)
  const context = String(request.body?.context || '').slice(0, MAX_CONTEXT)
  const history = Array.isArray(request.body?.history) ? request.body.history.slice(-6) : []
  if (!question || !context) return response.status(400).json({ error: 'Nedostaje pitanje ili kontekst udžbenika.' })

  const messages = history
    .filter((item) => item && (item.role === 'user' || item.role === 'assistant'))
    .map((item) => ({ role: item.role, content: String(item.text || '').slice(0, 1800) }))
  messages.push({ role: 'user', content: `PITANJE:\n${question}\n\nDOPUŠTENI IZVORI:\n${context}` })

  try {
    const anthropic = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest',
        max_tokens: 900,
        temperature: 0.2,
        system: `Ti si stručni AI vodič hrvatskog sveučilišnog udžbenika „Osnove turizma i ugostiteljstva”. Odgovaraj prirodnim, jasnim hrvatskim jezikom. Odgovor temelji isključivo na DOPUŠTENIM IZVORIMA iz posljednje korisničke poruke i relevantnoj kratkoj povijesti. Ne izmišljaj činjenice. Razlikuj kanonski tekst od uredničkog ili istraživačkog dodatka. Ako izvori nisu dovoljni, to izričito reci i predloži preciznije pitanje ili širi unutarnji opseg. Ne pretražuj vanjske izvore. Odgovori u 2–5 kratkih odlomaka, a na kraju dodaj redak "Izvor: ..." s najrelevantnijom oznakom izvora iz konteksta.`,
        messages,
      }),
    })
    const payload = await anthropic.json()
    if (!anthropic.ok) throw new Error(payload?.error?.message || 'AI usluga nije vratila odgovor.')
    const text = payload?.content?.filter((part) => part.type === 'text').map((part) => part.text).join('\n').trim()
    if (!text) throw new Error('AI usluga vratila je prazan odgovor.')
    const sourceMatch = text.match(/\n?Izvor:\s*(.+)$/i)
    return response.status(200).json({
      text: sourceMatch ? text.slice(0, sourceMatch.index).trim() : text,
      source: sourceMatch?.[1]?.trim() || 'AI odgovor utemeljen na odabranom opsegu udžbenika',
    })
  } catch (error) {
    return response.status(502).json({ error: error instanceof Error ? error.message : 'AI razgovor trenutačno nije dostupan.' })
  }
}
