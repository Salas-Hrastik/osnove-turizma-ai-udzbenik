import { createHmac, timingSafeEqual } from 'node:crypto'

function readCookie(request, name) {
  const header = String(request.headers?.cookie || '')
  for (const part of header.split(';')) {
    const [key, ...value] = part.trim().split('=')
    if (key === name) return decodeURIComponent(value.join('='))
  }
  return ''
}

function decodePayload(value) {
  return JSON.parse(Buffer.from(value, 'base64url').toString('utf8'))
}

export function hasValidAiedukaAccess(request, platformSlug = 'osnove-turizma') {
  const secret = process.env.AIEDUKA_ACCESS_TOKEN_SECRET?.trim()
  const token = readCookie(request, 'aieduka_access')
  if (!secret || secret.length < 32 || !token) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false

  try {
    const expected = createHmac('sha256', secret).update(`${parts[0]}.${parts[1]}`).digest()
    const received = Buffer.from(parts[2], 'base64url')
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) return false
    const payload = decodePayload(parts[1])
    return payload.platform === platformSlug && Number(payload.exp) > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}
