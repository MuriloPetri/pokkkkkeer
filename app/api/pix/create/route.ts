import { NextRequest, NextResponse } from "next/server"
import { PIX_AMOUNT_CENTS, PRODUCT_NAME } from "@/lib/pix-config"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

/**
 * POST /api/pix/create
 * Body: { email: string, firstName: string, lastName: string, cpf: string }
 * Cria uma cobrança PIX no Mercado Pago.
 */
export async function POST(req: NextRequest) {
  try {
    const { email, firstName, lastName, cpf, password } = await req.json()

    if (!email || !firstName || !cpf || !password) {
      return NextResponse.json({ error: "Preencha todos os campos e crie uma senha" }, { status: 400 })
    }

    const token = process.env.MERCADOPAGO_ACCESS_TOKEN
    if (!token || token === "APP_USR-SEU_ACCESS_TOKEN_AQUI") {
      return NextResponse.json(
        { error: "Mercado Pago não configurado no .env.local" },
        { status: 503 }
      )
    }

    // Mercado Pago usa o valor em Reais (float), não em centavos
    const amount = PIX_AMOUNT_CENTS / 100

    const res = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        // Chave de idempotência (evita cobrança dupla se houver instabilidade)
        "X-Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify({
        transaction_amount: amount,
        description: PRODUCT_NAME,
        payment_method_id: "pix",
        payer: {
          email: email.trim().toLowerCase(),
          first_name: firstName.trim(),
          last_name: lastName?.trim() || "",
          identification: {
            type: "CPF",
            number: cpf.replace(/\D/g, ""), // Limpa tudo que não for número
          },
        },
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error("[pix/create] MercadoPago error:", data)
      const msg = data.cause?.[0]?.description || data.message || "Erro ao criar cobrança"
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    const transactionData = data.point_of_interaction?.transaction_data

    // Criar ou atualizar usuário no banco com a nova senha
    const hashedPassword = await bcrypt.hash(password, 10)
    const safeEmail = email.trim().toLowerCase()
    
    let user = await db.user.findUnique({ where: { email: safeEmail } })
    if (user) {
      // Atualiza a senha se o usuário tentar pagar de novo (esquecimento, etc)
      user = await db.user.update({
        where: { id: user.id },
        data: { password: hashedPassword, name: firstName, cpf: cpf.replace(/\D/g, "") },
      })
    } else {
      user = await db.user.create({
        data: {
          email: safeEmail,
          name: firstName,
          cpf: cpf.replace(/\D/g, ""),
          password: hashedPassword,
        },
      })
    }

    // Salva a tentativa de pagamento
    await db.payment.create({
      data: {
        userId: user.id,
        chargeId: String(data.id),
        status: data.status || "pending",
        amount: amount,
      },
    })

    return NextResponse.json({
      chargeId: data.id,
      qrCodeString: transactionData?.qr_code,
      qrCodeBase64: transactionData?.qr_code_base64,
      status: data.status, // "pending"
    })
  } catch (err) {
    console.error("[pix/create]", err)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
