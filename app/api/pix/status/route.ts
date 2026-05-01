import { NextRequest, NextResponse } from "next/server"
import { signAccessToken } from "@/lib/pix-jwt"
import { ACCESS_COOKIE_NAME, ACCESS_DURATION_DAYS } from "@/lib/pix-config"

/**
 * GET /api/pix/status?id=bill_xxx&email=user@email.com
 *
 * Consulta o status da cobrança no AbacatePay.
 * Se PAID → emite cookie JWT httpOnly e retorna { paid: true }.
 * Se não  → retorna { paid: false, status }.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const chargeId = searchParams.get("id")
  const email = searchParams.get("email") ?? ""

  if (!chargeId) {
    return NextResponse.json({ error: "chargeId obrigatório" }, { status: 400 })
  }

  const apiKey = process.env.ABACATEPAY_API_KEY
  if (!apiKey || apiKey === "SEU_API_KEY_ABACATEPAY_AQUI") {
    return NextResponse.json({ error: "API não configurada" }, { status: 503 })
  }

  try {
    const res = await fetch(`https://api.abacatepay.com/v1/billing/${chargeId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      // Não usar cache — sempre buscar o status atual
      cache: "no-store",
    })

    const data = await res.json()

    if (!res.ok) {
      console.error("[pix/status] AbacatePay error:", data)
      return NextResponse.json({ error: "Erro ao consultar cobrança" }, { status: 502 })
    }

    const status: string = data?.data?.status ?? "PENDING"

    if (status === "PAID") {
      // ── Pagamento confirmado → emite cookie JWT seguro ─────────────
      const token = signAccessToken(chargeId, email)

      const response = NextResponse.json({ paid: true })
      response.cookies.set(ACCESS_COOKIE_NAME, token, {
        httpOnly: true,              // JS do cliente não consegue ler
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ACCESS_DURATION_DAYS * 24 * 60 * 60,
        path: "/",
      })
      return response
    }

    // Ainda não pago
    return NextResponse.json({ paid: false, status })
  } catch (err) {
    console.error("[pix/status]", err)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
