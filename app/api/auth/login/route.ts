import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { signAccessToken } from "@/lib/pix-jwt"
import { ACCESS_COOKIE_NAME, ACCESS_DURATION_DAYS } from "@/lib/pix-config"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Preencha e-mail e senha" }, { status: 400 })
    }

    const safeEmail = email.trim().toLowerCase()
    const user = await db.user.findUnique({ where: { email: safeEmail } })

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 })
    }

    if (!user.paidAt) {
      return NextResponse.json(
        { error: "Pagamento não confirmado. Você precisa concluir a compra antes." },
        { status: 403 }
      )
    }

    // Login com sucesso: gera o cookie JWT
    const jwtToken = await signAccessToken("login_auth", safeEmail)
    const response = NextResponse.json({ success: true })
    
    response.cookies.set(ACCESS_COOKIE_NAME, jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ACCESS_DURATION_DAYS * 24 * 60 * 60,
      path: "/",
    })

    return response
  } catch (err) {
    console.error("[auth/login]", err)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
