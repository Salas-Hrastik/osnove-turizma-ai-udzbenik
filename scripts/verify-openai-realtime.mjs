const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('OPENAI_API_KEY nije dostupan develop Preview izgradnji.')
}

const response = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    session: {
      type: 'realtime',
      model: 'gpt-realtime-2.1',
      audio: { output: { voice: 'marin' } },
    },
  }),
})

if (!response.ok) {
  const labels = {
    401: 'OPENAI_API_KEY nije valjan.',
    403: 'OpenAI projekt nema pristup Realtime modelu.',
    404: 'Model gpt-realtime-2.1 nije dostupan OpenAI projektu.',
    429: 'OpenAI projekt nema raspoloživu kvotu ili je dosegnuo ograničenje.',
  }
  throw new Error(labels[response.status] || `OpenAI Realtime provjera nije prošla (HTTP ${response.status}).`)
}

const payload = await response.json()
if (!payload?.value) {
  throw new Error('OpenAI nije vratio kratkotrajni Realtime ključ.')
}

console.log('OpenAI Realtime ključ, model i glas dostupni su develop Preview izgradnji.')
