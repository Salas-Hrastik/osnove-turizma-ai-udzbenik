import { createHmac, timingSafeEqual } from 'node:crypto'

const PLATFORM_SLUG = 'osnove-turizma'
const COOKIE_NAME = 'aieduka_access'

function readCookie(request, name) {
  const header = request.headers.cookie
  if (!header) return null
  for (const part of header.split(';')) {
    const index = part.indexOf('=')
    if (index === -1) continue
    const key = part.slice(0, index).trim()
    if (key === name) return decodeURIComponent(part.slice(index + 1).trim())
  }
  return null
}

function base64urlToBuffer(value) {
  return Buffer.from(value, 'base64url')
}

function verifyAccessToken(token, secret) {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [headerPart, bodyPart, signaturePart] = parts

  const expectedSignature = createHmac('sha256', secret).update(`${headerPart}.${bodyPart}`).digest()
  const providedSignature = base64urlToBuffer(signaturePart)
  if (expectedSignature.length !== providedSignature.length) return null
  if (!timingSafeEqual(expectedSignature, providedSignature)) return null

  let payload
  try {
    payload = JSON.parse(base64urlToBuffer(bodyPart).toString('utf8'))
  } catch {
    return null
  }

  if (payload.platform !== PLATFORM_SLUG) return null
  if (typeof payload.exp !== 'number' || payload.exp <= Math.floor(Date.now() / 1000)) return null

  return payload
}

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'private, no-store')

  const secret = process.env.AIEDUKA_ACCESS_TOKEN_SECRET
  const token = readCookie(request, COOKIE_NAME)
  if (!secret || !token) return response.status(200).json({ authenticated: false })

  const payload = verifyAccessToken(token, secret)
  if (!payload) return response.status(200).json({ authenticated: false })

  return response.status(200).json({
    authenticated: true,
    email: payload.email,
    expiresAt: payload.exp,
  })
}
