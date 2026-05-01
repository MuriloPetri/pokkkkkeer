import { NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "@/lib/pix-jwt"
import { ACCESS_COOKIE_NAME } from "@/lib/pix-config"

/**
 * Proxy (anteriormente "middleware") — roda em TODA requisição de página.
 * Valida o cookie JWT assinado pelo servidor.
 * Se inválido/ausente → redireciona para /paywall.
 */
export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Página do paywall e login nunca são bloqueadas
  if (pathname === "/paywall" || pathname === "/login") {
    return NextResponse.next()
  }

  const token = req.cookies.get(ACCESS_COOKIE_NAME)?.value
  const payload = token ? verifyAccessToken(token) : null

  if (!payload) {
    const url = req.nextUrl.clone()
    url.pathname = "/paywall"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api/pix|api/auth|login|paywall|_next/static|_next/image|favicon|qrcode|icons|manifest|sw\\.js|workbox).*)",
  ],
}
