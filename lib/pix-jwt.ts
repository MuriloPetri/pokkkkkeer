/**
 * JWT leve usando Web Crypto API (Edge-compatible)
 * Assinatura HMAC-SHA256. Roda em Node.js e Edge Runtime (Vercel).
 */
import { ACCESS_DURATION_DAYS } from "./pix-config"

const encoder = new TextEncoder()

function base64urlEncode(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
}

function base64urlDecode(str: string): Uint8Array {
  str = str.replace(/-/g, "+").replace(/_/g, "/")
  while (str.length % 4) str += "="
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0))
}

async function getSecretKey(): Promise<CryptoKey> {
  const secret = process.env.PIX_JWT_SECRET
  if (!secret) throw new Error("PIX_JWT_SECRET não configurado")
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )
}

interface TokenPayload {
  chargeId: string
  email: string
  paidAt: number // unix ms
  exp: number    // unix ms
}

export async function signAccessToken(chargeId: string, email: string): Promise<string> {
  const payload: TokenPayload = {
    chargeId,
    email,
    paidAt: Date.now(),
    exp: Date.now() + ACCESS_DURATION_DAYS * 24 * 60 * 60 * 1000,
  }
  
  const header = base64urlEncode(encoder.encode(JSON.stringify({ alg: "HS256", typ: "JWT" })))
  const data = base64urlEncode(encoder.encode(JSON.stringify(payload)))
  const message = `${header}.${data}`
  
  const key = await getSecretKey()
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message))
  
  return `${message}.${base64urlEncode(sig)}`
}

export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  try {
    const [header, data, sig] = token.split(".")
    if (!header || !data || !sig) return null

    const key = await getSecretKey()
    const message = `${header}.${data}`
    const sigBuf = base64urlDecode(sig)
    
    const isValid = await crypto.subtle.verify("HMAC", key, sigBuf, encoder.encode(message))
    if (!isValid) return null

    const payload: TokenPayload = JSON.parse(new TextDecoder().decode(base64urlDecode(data)))

    if (Date.now() > payload.exp) return null
    return payload
  } catch (err) {
    console.error("[JWT] Error verifying token:", err)
    return null
  }
}

/** Lê e valida o cookie de acesso (server component / middleware) */
export async function getAccessFromCookie(cookieValue: string | undefined): Promise<TokenPayload | null> {
  if (!cookieValue) return null
  return verifyAccessToken(cookieValue)
}

