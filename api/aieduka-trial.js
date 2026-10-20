export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('allow', 'POST')
    return response.status(405).send('Dopušten je samo POST zahtjev.')
  }

  const body = typeof request.body === 'string' ? new URLSearchParams(request.body) : request.body
  const email = String(body?.get?.('email') ?? body?.email ?? '').trim().toLowerCase()
  const requestedNext = String(body?.get?.('next') ?? body?.next ?? '/')
  const next = requestedNext.startsWith('/') && !requestedNext.startsWith('//') ? requestedNext : '/'

  const redirectWith = (params) => {
    const url = new URL('/aktivacija.html', `https://${request.headers.host}`)
    url.searchParams.set('next', next)
    for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value)
    return response.redirect(303, url.pathname + url.search)
  }

  if (!email) return redirectWith({ greska: 'Unesite adresu e-pošte.' })

  try {
    const trial = await fetch('https://www.aieduka.hr/api/licenses/trial', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, platformSlug: 'osnove-turizma' }),
    })
    const result = await trial.json()
    if (!trial.ok || !result.ok) {
      return redirectWith({ greska: result.error || 'Probno korištenje trenutačno nije dostupno.' })
    }
    return redirectWith({
      poruka: 'Probni pristupni token poslan je na navedenu e-poštu. Unesite ga u polje "Pristupni kod" da otvorite platformu.',
    })
  } catch {
    return redirectWith({ greska: 'Probno korištenje trenutačno nije dostupno. Pokušajte ponovno.' })
  }
}
