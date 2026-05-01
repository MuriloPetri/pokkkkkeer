import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyAccessToken } from "@/lib/pix-jwt"
import { ACCESS_COOKIE_NAME } from "@/lib/pix-config"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(ACCESS_COOKIE_NAME)?.value

  // Se já está logado e tenta ir pro paywall ou login, manda pra home
  if (token && (pathname === "/paywall" || pathname === "/login")) {
    const isValid = await verifyAccessToken(token)
    if (isValid) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Rotas que EXIGEM login/pagamento
  const protectedRoutes = ["/"]
  const isProtectedRoute = protectedRoutes.includes(pathname)

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/paywall", request.url))
    }

    const isValid = await verifyAccessToken(token)
    if (!isValid) {
      // Token inválido ou expirado -> Limpa o cookie e manda pro paywall
      const response = NextResponse.redirect(new URL("/paywall", request.url))
      response.cookies.delete(ACCESS_COOKIE_NAME)
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/paywall",
    "/login",
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (arquivos na pasta public)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public|contato|sobre|politica-de-privacidade|termos-de-uso).*)",
  ],
}

