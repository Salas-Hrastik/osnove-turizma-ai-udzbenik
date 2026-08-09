const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('OPENAI_API_KEY nije dostupan ovoj Preview izgradnji.')
}

console.log('OPENAI_API_KEY je dostupan Preview izgradnji.')
