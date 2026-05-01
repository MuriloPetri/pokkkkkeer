"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Lock, Mail, ExternalLink, Loader2,
  Check, ShieldCheck, Zap, Trophy, AlertCircle,
} from "lucide-react"
import { PIX_AMOUNT_DISPLAY, PRODUCT_NAME } from "@/lib/pix-config"

type Step = "email" | "paying" | "success"

const FEATURES = [
  "Ranges GTO otimizados para 6-max e 9-max",
  "Simulador de 3-bet e 4-bet interativo",
  "Modo treinamento com feedback em tempo real",
  "Acesso vitalício + todas as atualizações",
]

export default function PaywallPage() {
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [chargeId, setChargeId] = useState("")
  const [payUrl, setPayUrl] = useState("")
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

  // ── Criar cobrança ───────────────────────────────────────────────────
  const handleCreateCharge = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/pix/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Erro ao gerar cobrança. Tente novamente.")
        return
      }

      setChargeId(data.chargeId)
      setPayUrl(data.url)
      setStep("paying")
    } catch {
      setError("Erro de conexão. Verifique sua internet e tente novamente.")
    } finally {
      setLoading(false)
    }
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
                  via PIX. Acesso vitalício liberado automaticamente após confirmação.
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

              {/* ── ETAPA 1: E-mail ────────────────────────────────── */}
              {step === "email" && (
                <form onSubmit={handleCreateCharge} className="w-full space-y-5">
                  <div className="text-center space-y-1">
                    <p className="font-semibold text-white">Informe seu e-mail</p>
                    <p className="text-xs text-zinc-500">Para gerar sua cobrança PIX</p>
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

                  {error && (
                    <div className="flex items-start gap-2 rounded-lg border border-red-900/50 bg-red-950/30 p-3 text-xs text-red-400">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 text-base font-bold text-white shadow-lg shadow-green-900/30 transition-all hover:bg-green-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
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
                <div className="w-full space-y-5">
                  <div className="text-center space-y-1">
                    <p className="font-semibold text-white">Pague via PIX</p>
                    <p className="text-xs text-zinc-500">
                      O acesso é liberado automaticamente após confirmação
                    </p>
                  </div>

                  {/* Botão para abrir página de pagamento */}
                  <a
                    href={payUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 text-base font-bold text-white shadow-lg shadow-green-900/30 transition-all hover:bg-green-500 hover:scale-[1.02]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Abrir QR Code PIX — R$ {PIX_AMOUNT_DISPLAY}
                  </a>

                  <div className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                    <Loader2 className="h-4 w-4 animate-spin text-green-500" />
                    <span className="text-sm text-zinc-400">
                      Aguardando pagamento
                      <span className="text-zinc-600 ml-1">
                        ({Math.floor(pollCount * 3)}s)
                      </span>
                    </span>
                  </div>

                  <p className="text-center text-[11px] text-zinc-600">
                    Após pagar, o acesso é liberado em segundos automaticamente.
                    Não feche esta aba.
                  </p>

                  <button
                    onClick={() => { stopPolling(); setStep("email"); setError("") }}
                    className="w-full text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    ← Voltar e trocar e-mail
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
          Site para fins educacionais. Pagamento processado via AbacatePay.
        </p>
      </div>
    </div>
  )
}
