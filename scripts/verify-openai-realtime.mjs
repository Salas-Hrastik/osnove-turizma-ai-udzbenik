const apiKey = process.env.OPENAI_API_KEY
const model = process.env.OPENAI_REALTIME_MODEL || 'gpt-realtime-2.1'
const voice = process.env.OPENAI_REALTIME_VOICE || 'marin'

if (!apiKey) {
  throw new Error('OPENAI_API_KEY nije dostupan ovoj Preview izgradnji.')
}

const response = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
  method: 'POST',
  headers: {
    authorization: `Bearer ${apiKey}`,
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    session: {
      type: 'realtime',
      model,
      output_modalities: ['audio'],
      audio: { output: { voice } },
      instructions: 'Odgovaraj kratko i prirodno na hrvatskom jeziku.',
    },
  }),
  signal: AbortSignal.timeout(30000),
})

const raw = await response.text()
let payload
try {
  payload = JSON.parse(raw)
} catch {
  payload = null
}

if (!response.ok) {
  const detail = payload?.error?.message || 'OpenAI nije prihvatio zahtjev.'
  throw new Error(`OpenAI Realtime provjera nije prošla (${response.status}): ${detail}`)
}

if (typeof payload?.value !== 'string' || !payload.value) {
  throw new Error('OpenAI Realtime nije vratio kratkotrajni klijentski token.')
}

console.log(`OpenAI Realtime Preview provjera uspješna: ${model}, glas ${voice}.`)
