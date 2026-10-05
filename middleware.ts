import { next } from "@vercel/functions";

const PLATFORM_SLUG = "osnove-turizma";
const COOKIE_NAME = "aieduka_access";
const PUBLIC_PATHS = ["/aktivacija", "/aktivacija.html", "/api/aieduka-activate", "/robots.txt", "/favicon.ico", "/.well-known/"];

function readCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get("cookie") || "";
  for (const part of cookieHeader.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
}

function fromBase64url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function hasAccess(request: Request) {
  const secret = process.env.AIEDUKA_ACCESS_TOKEN_SECRET?.trim();
  const token = readCookie(request, COOKIE_NAME);
  if (!secret || secret.length < 32 || !token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  try {
    const data = `${parts[0]}.${parts[1]}`;
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const valid = await crypto.subtle.verify("HMAC", key, fromBase64url(parts[2]), new TextEncoder().encode(data));
    if (!valid) return false;
    const payload = JSON.parse(new TextDecoder().decode(fromBase64url(parts[1])));
    return payload.platform === PLATFORM_SLUG && Number(payload.exp) > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((path) => pathname === path || (path.endsWith("/") && pathname.startsWith(path)));
}

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  if (isPublic(url.pathname) || await hasAccess(request)) return next();

  if (url.pathname.startsWith("/api/")) {
    return Response.json({ error: "Za korištenje platforme potreban je aktivan pristup." }, { status: 401 });
  }

  const activation = new URL("/aktivacija.html", request.url);
  activation.searchParams.set("next", url.pathname + url.search);
  return Response.redirect(activation, 307);
}

export const config = {
  matcher: ["/((?!assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff2?)$).*)"],
};
