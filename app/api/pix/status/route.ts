import { NextRequest, NextResponse } from "next/server"
import { signAccessToken } from "@/lib/pix-jwt"
import { ACCESS_COOKIE_NAME, ACCESS_DURATION_DAYS } from "@/lib/pix-config"
import { db } from "@/lib/db"

/**
 * GET /api/pix/status?id=123456&email=user@email.com
 *
 * Consulta o status da cobrança no Mercado Pago.
 * Se "approved" → emite cookie JWT httpOnly e retorna { paid: true }.
 * Se não       → retorna { paid: false, status }.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const chargeId = searchParams.get("id")
  const email = searchParams.get("email") ?? ""

  if (!chargeId) {
    return NextResponse.json({ error: "chargeId obrigatório" }, { status: 400 })
  }

  const token = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!token || token === "APP_USR-SEU_ACCESS_TOKEN_AQUI") {
    return NextResponse.json({ error: "API não configurada" }, { status: 503 })
  }

  try {
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${chargeId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })

    const data = await res.json()

    if (!res.ok) {
      console.error("[pix/status] MercadoPago error:", data)
      return NextResponse.json({ error: "Erro ao consultar cobrança" }, { status: 502 })
    }

    const status: string = data.status ?? "pending"

    if (status === "approved") {
      // Atualiza o banco de dados
      const payment = await db.payment.findUnique({
        where: { chargeId: String(chargeId) },
        include: { user: true }
      })

      if (payment && !payment.user.paidAt) {
        await db.$transaction([
          db.payment.update({
            where: { id: payment.id },
            data: { status: "approved" }
          }),
          db.user.update({
            where: { id: payment.userId },
            data: { paidAt: new Date() }
          })
        ])
      }

      // ── Pagamento confirmado → emite cookie JWT seguro ─────────────
      const jwtToken = signAccessToken(chargeId, email)

      const response = NextResponse.json({ paid: true })
      response.cookies.set(ACCESS_COOKIE_NAME, jwtToken, {
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
