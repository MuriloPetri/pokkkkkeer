import { NextRequest, NextResponse } from "next/server"
import { PIX_AMOUNT_CENTS, PRODUCT_NAME } from "@/lib/pix-config"

/**
 * POST /api/pix/create
 * Body: { email: string, name?: string }
 * Cria uma cobrança PIX no AbacatePay e retorna os dados para o frontend.
 */
export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json()

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "E-mail inválido" }, { status: 400 })
    }

    const apiKey = process.env.ABACATEPAY_API_KEY
    if (!apiKey || apiKey === "SEU_API_KEY_ABACATEPAY_AQUI") {
      return NextResponse.json(
        { error: "AbacatePay não configurado. Adicione ABACATEPAY_API_KEY no .env.local" },
        { status: 503 }
      )
    }

    const res = await fetch("https://api.abacatepay.com/v1/billing/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        frequency: "ONE_TIME",
        methods: ["PIX"],
        products: [
          {
            externalId: "poker-access",
            name: PRODUCT_NAME,
            quantity: 1,
            price: PIX_AMOUNT_CENTS, // centavos
          },
        ],
        customer: {
          name: name?.trim() || email.split("@")[0],
          email: email.trim().toLowerCase(),
        },
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error("[pix/create] AbacatePay error:", data)
      return NextResponse.json(
        { error: data?.message || "Erro ao criar cobrança" },
        { status: 502 }
      )
    }

    const billing = data?.data
    return NextResponse.json({
      chargeId: billing?.id,
      url: billing?.url,          // URL da página de pagamento AbacatePay
      status: billing?.status,    // "PENDING"
    })
  } catch (err) {
    console.error("[pix/create]", err)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
