if (process.env.VERCEL_ENV !== 'preview') {
  console.log('[verify-anthropic] Preskočeno izvan Vercel Preview okruženja.')
  process.exit(0)
}

const apiKey = process.env.ANTHROPIC_API_KEY
const model = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5'

if (!apiKey) {
  throw new Error('[verify-anthropic] ANTHROPIC_API_KEY nije dostupan Preview buildu.')
}

const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
  },
  body: JSON.stringify({
    model,
    max_tokens: 20,
    messages: [{ role: 'user', content: 'Odgovori samo riječju: u redu.' }],
  }),
})

const payload = await response.json()
if (!response.ok) {
  throw new Error(`[verify-anthropic] Anthropic ${response.status}: ${payload?.error?.message || 'nepoznata pogreška'}`)
}

const text = payload?.content?.find((part) => part.type === 'text')?.text?.trim()
if (!text) {
  throw new Error('[verify-anthropic] Anthropic je vratio prazan tekstualni odgovor.')
}

console.log(`[verify-anthropic] Uspjeh: ključ i model ${model} vraćaju tekst.`)
