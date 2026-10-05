const PLATFORM_SLUG = 'osnove-turizma'
const AIEDUKA_ORIGIN = 'https://www.aieduka.hr'
const COOKIE_NAME = 'aieduka_access'

function cookieAttributes(expiresAt) {
  const maxAge = Math.max(0, expiresAt - Math.floor(Date.now() / 1000))
  const parts = [
    `Max-Age=${maxAge}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
  ]
  return parts.join('; ')
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('allow', 'POST')
    return response.status(405).json({ error: 'Dopušten je samo POST zahtjev.' })
  }

  let body = request.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return response.status(400).json({ error: 'Tijelo zahtjeva nije ispravan JSON.' })
    }
  }

  const email = String(body?.email || '').trim().toLowerCase()
  const token = String(body?.token || '').trim()
  if (!email || !token) {
    return response.status(400).json({ error: 'Unesite e-poštu i pristupni kod.' })
  }

  let upstream
  try {
    upstream = await fetch(`${AIEDUKA_ORIGIN}/api/licenses/activate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, token, platformSlug: PLATFORM_SLUG }),
      signal: AbortSignal.timeout(15000),
    })
  } catch {
    return response.status(502).json({ error: 'Aktivacija trenutačno nije dostupna. Pokušajte ponovno.' })
  }

  const payload = await upstream.json().catch(() => null)
  if (!upstream.ok || !payload?.accessToken) {
    const message = payload?.error || 'Pristupni kod nije valjan, ne pripada ovoj e-pošti ili je istekao.'
    return response.status(upstream.status || 502).json({ error: message })
  }

  response.setHeader('Set-Cookie', `${COOKIE_NAME}=${payload.accessToken}; ${cookieAttributes(payload.expiresAt)}`)
  return response.status(200).json({ ok: true })
}
