/**
 * JWT leve usando Node.js crypto nativo — sem dependências externas.
 * Assinatura HMAC-SHA256. Só roda no servidor.
 */
import { createHmac, timingSafeEqual, randomBytes } from "crypto"
import { ACCESS_DURATION_DAYS, ACCESS_COOKIE_NAME } from "./pix-config"
import { cookies } from "next/headers"

function getSecret(): string {
  const secret = process.env.PIX_JWT_SECRET
  if (!secret) throw new Error("PIX_JWT_SECRET não configurado no .env.local")
  return secret
}

interface TokenPayload {
  chargeId: string
  email: string
  paidAt: number // unix ms
  exp: number    // unix ms
}

export function signAccessToken(chargeId: string, email: string): string {
  const payload: TokenPayload = {
    chargeId,
    email,
    paidAt: Date.now(),
    exp: Date.now() + ACCESS_DURATION_DAYS * 24 * 60 * 60 * 1000,
  }
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url")
  const sig = createHmac("sha256", getSecret()).update(data).digest("base64url")
  return `${data}.${sig}`
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const [data, sig] = token.split(".")
    if (!data || !sig) return null

    const expected = createHmac("sha256", getSecret())
      .update(data)
      .digest("base64url")

    const sigBuf = Buffer.from(sig, "base64url")
    const expBuf = Buffer.from(expected, "base64url")
    if (sigBuf.length !== expBuf.length) return null
    if (!timingSafeEqual(sigBuf, expBuf)) return null

    const payload: TokenPayload = JSON.parse(
      Buffer.from(data, "base64url").toString()
    )

    if (Date.now() > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

/** Lê e valida o cookie de acesso (server component / middleware) */
export function getAccessFromCookie(cookieValue: string | undefined): TokenPayload | null {
  if (!cookieValue) return null
  return verifyAccessToken(cookieValue)
}
