export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('allow', 'POST')
    return response.status(405).send('Dopušten je samo POST zahtjev.')
  }

  const body = typeof request.body === 'string' ? new URLSearchParams(request.body) : request.body
  const email = String(body?.get?.('email') ?? body?.email ?? '').trim().toLowerCase()
  const token = String(body?.get?.('token') ?? body?.token ?? '').trim()
  const requestedNext = String(body?.get?.('next') ?? body?.next ?? '/')
  const next = requestedNext.startsWith('/') && !requestedNext.startsWith('//') ? requestedNext : '/'

  try {
    const activation = await fetch('https://www.aieduka.hr/api/licenses/activate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, token, platformSlug: 'osnove-turizma' }),
    })
    const result = await activation.json()
    if (!activation.ok || !result.accessToken || !result.expiresAt) {
      const url = new URL('/aktivacija.html', `https://${request.headers.host}`)
      url.searchParams.set('greska', result.error || 'Kod nije valjan za ovu platformu ili je istekao.')
      url.searchParams.set('next', next)
      return response.redirect(303, url.pathname + url.search)
    }

    const maxAge = Math.max(60, result.expiresAt - Math.floor(Date.now() / 1000))
    response.setHeader('Set-Cookie', `aieduka_access=${encodeURIComponent(result.accessToken)}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Lax`)
    response.setHeader('Cache-Control', 'private, no-store')
    return response.redirect(303, next)
  } catch {
    const url = new URL('/aktivacija.html', `https://${request.headers.host}`)
    url.searchParams.set('greska', 'Aktivacija trenutačno nije dostupna. Pokušajte ponovno.')
    url.searchParams.set('next', next)
    return response.redirect(303, url.pathname + url.search)
  }
}
