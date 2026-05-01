"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Lock, Mail, User, CreditCard, Loader2,
  Check, ShieldCheck, Zap, Trophy, AlertCircle, Copy
} from "lucide-react"
import { PIX_AMOUNT_DISPLAY, PRODUCT_NAME } from "@/lib/pix-config"
import Image from "next/image"

type Step = "info" | "paying" | "success"

const FEATURES = [
  "Ranges GTO otimizados para 6-max e 9-max",
  "Simulador de 3-bet e 4-bet interativo",
  "Modo treinamento com feedback em tempo real",
  "Acesso vitalício + todas as atualizações",
]

export default function PaywallPage() {
  const [step, setStep] = useState<Step>("info")
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [cpf, setCpf] = useState("")
  const [password, setPassword] = useState("")
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [chargeId, setChargeId] = useState("")
  const [qrCodeString, setQrCodeString] = useState("")
  const [qrCodeBase64, setQrCodeBase64] = useState("")
  const [copied, setCopied] = useState(false)
  
  const [pollCount, setPollCount] = useState(0)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Polling de status ────────────────────────────────────────────────
  const stopPolling = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current)
  }, [])

  const checkStatus = useCallback(async (id: string, mail: string) => {
    try {
      const res = await fetch(`/api/pix/status?id=${id}&email=${encodeURIComponent(mail)}`)
      const data = await res.json()

      if (data.paid) {
        stopPolling()
        setStep("success")
        // Redireciona para a home após 2s (middleware vai liberar com o cookie)
        setTimeout(() => { window.location.href = "/" }, 2000)
      } else {
        setPollCount((n) => n + 1)
      }
    } catch {
      // Erro de rede — ignora e tenta de novo
    }
  }, [stopPolling])

  useEffect(() => {
    if (step === "paying" && chargeId) {
      pollRef.current = setInterval(() => checkStatus(chargeId, email), 3000)
    }
    return stopPolling
  }, [step, chargeId, email, checkStatus, stopPolling])

  // ── Criar cobrança Mercado Pago ──────────────────────────────────────
  const handleCreateCharge = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/pix/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, lastName: "", cpf, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Erro ao gerar cobrança. Verifique seus dados.")
        return
      }

      setChargeId(data.chargeId)
      setQrCodeString(data.qrCodeString)
      setQrCodeBase64(data.qrCodeBase64)
      setStep("paying")
    } catch {
      setError("Erro de conexão. Verifique sua internet e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!qrCodeString) return
    navigator.clipboard.writeText(qrCodeString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Mascara simples para CPF na digitação
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "")
    if (v.length > 11) v = v.slice(0, 11)
    v = v.replace(/(\d{3})(\d)/, "$1.$2")
    v = v.replace(/(\d{3})(\d)/, "$1.$2")
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    setCpf(v)
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4 py-12">
      {/* Glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-green-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-700/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/80 shadow-2xl backdrop-blur-md">

          {/* Banner */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/60 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <Lock className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium text-zinc-400">Conteúdo protegido</span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-green-400 ring-1 ring-green-500/30">
              <Zap className="h-3 w-3" /> Acesso Único
            </span>
          </div>

          <div className="grid lg:grid-cols-2">
            {/* Benefícios */}
            <div className="flex flex-col justify-center gap-8 p-8 lg:p-10">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Premium</span>
                </div>
                <h1 className="text-3xl font-extrabold leading-tight text-white lg:text-4xl">
                  Eleve seu jogo ao{" "}
                  <span className="text-green-400">Nível Profissional</span>
                </h1>
                <p className="text-sm leading-relaxed text-zinc-400">
                  Pagamento único de{" "}
                  <span className="font-bold text-white">R$ {PIX_AMOUNT_DISPLAY}</span>{" "}
                  via PIX. Acesso vitalício liberado automaticamente.
                </p>
              </div>
              <ul className="space-y-3">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-300">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex items-end gap-3">
                <div className="text-6xl font-black italic text-white">R$&nbsp;{PIX_AMOUNT_DISPLAY}</div>
                <div className="mb-1 flex flex-col gap-0.5">
                  <span className="text-xs text-zinc-500 line-through">R$ 47,00</span>
                  <span className="text-xs text-green-400">pagamento único</span>
                </div>
              </div>
            </div>

            {/* Painel de pagamento */}
            <div className="flex flex-col items-center justify-center gap-6 border-t border-zinc-800 bg-zinc-950/40 p-8 lg:border-l lg:border-t-0 lg:p-10">

              {/* ── ETAPA 1: Dados do Cliente ────────────────────────── */}
              {step === "info" && (
                <form onSubmit={handleCreateCharge} className="w-full space-y-4">
                  <div className="text-center space-y-1 mb-2">
                    <p className="font-semibold text-white">Dados para Pagamento</p>
                    <p className="text-xs text-zinc-500">Exigido pelo Banco Central para gerar PIX</p>
                  </div>

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      required
                      placeholder="Nome e Sobrenome"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/50"
                    />
                  </div>

                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      required
                      placeholder="CPF"
                      value={cpf}
                      onChange={handleCpfChange}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/50"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="email"
                      required
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/50"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="password"
                      required
                      placeholder="Crie uma senha de acesso"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/50"
                    />
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 rounded-lg border border-red-900/50 bg-red-950/30 p-3 text-xs text-red-400">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 text-base font-bold text-white shadow-lg shadow-green-900/30 transition-all hover:bg-green-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Gerando PIX...</>
                    ) : (
                      <>Gerar PIX — R$ {PIX_AMOUNT_DISPLAY}</>
                    )}
                  </button>
                </form>
              )}

              {/* ── ETAPA 2: Aguardando pagamento ──────────────────── */}
              {step === "paying" && (
                <div className="w-full flex flex-col items-center space-y-5">
                  <div className="text-center space-y-1">
                    <p className="font-semibold text-white">Escaneie o QR Code</p>
                    <p className="text-xs text-zinc-500">Ou copie o código "PIX Copia e Cola"</p>
                  </div>

                  {/* QR Code MP */}
                  <div className="rounded-2xl bg-white p-3 shadow-xl">
                    {qrCodeBase64 ? (
                      <Image
                        src={`data:image/jpeg;base64,${qrCodeBase64}`}
                        alt="QR Code PIX Mercado Pago"
                        width={180}
                        height={180}
                        className="rounded-lg"
                        unoptimized
                      />
                    ) : (
                      <div className="h-[180px] w-[180px] bg-zinc-200 animate-pulse rounded-lg" />
                    )}
                  </div>

                  {/* Copia e Cola */}
                  <div className="w-full space-y-1.5">
                    <button
                      onClick={handleCopy}
                      className="group flex w-full items-center justify-between rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 transition-all hover:border-green-700 hover:bg-zinc-800/80"
                    >
                      <code className="max-w-[200px] truncate font-mono text-xs text-green-400">
                        {qrCodeString || "Gerando..."}
                      </code>
                      <span className="ml-2 shrink-0">
                        {copied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-zinc-500 transition-colors group-hover:text-green-400" />
                        )}
                      </span>
                    </button>
                  </div>

                  <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-900/30 bg-green-950/20 p-4">
                    <Loader2 className="h-4 w-4 animate-spin text-green-500" />
                    <span className="text-sm text-zinc-300">
                      Aguardando confirmação
                      <span className="text-green-500/50 ml-1 text-xs">
                        ({Math.floor(pollCount * 3)}s)
                      </span>
                    </span>
                  </div>

                  <button
                    onClick={() => { stopPolling(); setStep("info"); setError("") }}
                    className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors mt-2"
                  >
                    ← Cancelar e voltar
                  </button>
                </div>
              )}

              {/* ── ETAPA 3: Sucesso ───────────────────────────────── */}
              {step === "success" && (
                <div className="w-full space-y-4 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                    <Check className="h-8 w-8 text-green-400" />
                  </div>
                  <p className="text-xl font-bold text-white">Pagamento confirmado! 🃏</p>
                  <p className="text-sm text-zinc-400">Redirecionando para o {PRODUCT_NAME}...</p>
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-green-500" />
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-700">
          Site para fins educacionais. Pagamento processado de forma segura via Mercado Pago.
        </p>

        <div className="mt-8 text-center">
          <a href="/login" className="text-sm text-zinc-400 hover:text-white underline decoration-zinc-700 underline-offset-4">
            Já comprou? Faça login para acessar.
          </a>
        </div>
      </div>
    </div>
  )
}
