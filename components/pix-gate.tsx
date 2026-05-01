"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import {
  Check,
  Copy,
  QrCode,
  Lock,
  Unlock,
  ShieldCheck,
  Zap,
  Trophy,
  ChevronRight,
} from "lucide-react"
import { toast } from "sonner"
import {
  PIX_KEY,
  PIX_AMOUNT_DISPLAY,
  PIX_QRCODE_URL,
  PRODUCT_NAME,
  STORAGE_KEY,
} from "@/lib/pix-config"

// ─── Sub-componente: Badge animado ───────────────────────────────────────────
function AnimatedBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-green-400 ring-1 ring-green-500/30">
      {children}
    </span>
  )
}

// ─── Sub-componente: Feature item ────────────────────────────────────────────
function Feature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2.5 text-sm text-zinc-300">
      <ShieldCheck className="h-4 w-4 shrink-0 text-green-500" />
      {text}
    </li>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
interface PixGateProps {
  children: React.ReactNode
}

export function PixGate({ children }: PixGateProps) {
  const [paid, setPaid] = useState<boolean | null>(null) // null = carregando
  const [copied, setCopied] = useState(false)
  const [confirming, setConfirming] = useState(false)

  // Lê localStorage ao montar
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    setPaid(stored === "true")
  }, [])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(PIX_KEY)
    setCopied(true)
    toast.success("Chave PIX copiada!")
    setTimeout(() => setCopied(false), 2500)
  }, [])

  // Usuário clica "Já paguei" → simula confirmação e libera acesso
  const handleConfirmPayment = useCallback(() => {
    setConfirming(true)
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, "true")
      setPaid(true)
      toast.success("Acesso liberado! Bem-vindo ao Treinador Premium 🃏")
      setConfirming(false)
    }, 1200)
  }, [])

  // ── Loading splash (evita flash) ──────────────────────────────────────────
  if (paid === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
      </div>
    )
  }

  // ── Já pagou → renderiza o site normalmente ───────────────────────────────
  if (paid) {
    return <>{children}</>
  }

  // ── Paywall ───────────────────────────────────────────────────────────────
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4 py-12">
      {/* Glow de fundo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-green-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-700/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        {/* Card principal */}
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/80 shadow-2xl backdrop-blur-md">
          
          {/* Banner topo */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/60 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <Lock className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium text-zinc-400">
                Conteúdo bloqueado
              </span>
            </div>
            <AnimatedBadge>
              <Zap className="h-3 w-3" />
              Acesso Único
            </AnimatedBadge>
          </div>

          <div className="grid gap-0 lg:grid-cols-2">
            {/* ── Coluna esquerda: benefícios ─────────────────────────── */}
            <div className="flex flex-col justify-center gap-8 p-8 lg:p-10">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                    Premium
                  </span>
                </div>
                <h1 className="text-3xl font-extrabold leading-tight text-white lg:text-4xl">
                  Eleve seu jogo ao{" "}
                  <span className="text-green-400">Nível Profissional</span>
                </h1>
                <p className="text-sm leading-relaxed text-zinc-400">
                  Um único pagamento de{" "}
                  <span className="font-bold text-white">
                    R$ {PIX_AMOUNT_DISPLAY}
                  </span>{" "}
                  libera acesso vitalício ao Treinador de Poker completo.
                </p>
              </div>

              <ul className="space-y-3">
                {[
                  "Ranges GTO otimizados para 6-max e 9-max",
                  "Simulador de 3-bet e 4-bet interativo",
                  "Modo treinamento com feedback em tempo real",
                  "Acesso vitalício + todas as atualizações",
                ].map((f) => (
                  <Feature key={f} text={f} />
                ))}
              </ul>

              {/* Preço */}
              <div className="flex items-end gap-3">
                <div className="text-6xl font-black italic text-white">
                  R$&nbsp;{PIX_AMOUNT_DISPLAY}
                </div>
                <div className="mb-1 flex flex-col gap-0.5">
                  <span className="text-xs text-zinc-500 line-through">
                    R$ 47,00
                  </span>
                  <span className="text-xs text-green-400">pagamento único</span>
                </div>
              </div>
            </div>

            {/* ── Coluna direita: PIX ─────────────────────────────────── */}
            <div className="flex flex-col items-center justify-center gap-6 border-t border-zinc-800 bg-zinc-950/40 p-8 lg:border-l lg:border-t-0 lg:p-10">
              <p className="text-center text-sm font-medium text-zinc-400">
                Pague via PIX e clique em{" "}
                <span className="text-green-400">"Já paguei"</span>
              </p>

              {/* QR Code */}
              <div className="rounded-2xl bg-white p-3 shadow-xl">
                {PIX_QRCODE_URL ? (
                  <Image
                    src={PIX_QRCODE_URL}
                    alt="QR Code PIX"
                    width={180}
                    height={180}
                    className="rounded-lg"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-44 w-44 flex-col items-center justify-center gap-2 rounded-lg bg-zinc-100">
                    <QrCode className="h-20 w-20 text-zinc-800" />
                    <p className="px-2 text-center text-[10px] leading-tight text-zinc-500">
                      Adicione seu QR Code em{" "}
                      <code className="font-mono">lib/pix-config.ts</code>
                    </p>
                  </div>
                )}
              </div>

              {/* Chave PIX */}
              <div className="w-full space-y-1.5">
                <p className="text-center text-xs font-medium text-zinc-500">
                  Ou copie a chave PIX
                </p>
                <button
                  onClick={handleCopy}
                  className="group flex w-full items-center justify-between rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 transition-all hover:border-green-700 hover:bg-zinc-800/80"
                >
                  <code className="max-w-[200px] truncate font-mono text-sm text-green-400">
                    {PIX_KEY}
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

              {/* Valor */}
              <div className="flex w-full items-center justify-between rounded-xl border border-green-900/50 bg-green-950/30 px-4 py-3">
                <span className="text-sm text-zinc-400">Valor</span>
                <span className="text-lg font-bold text-green-400">
                  R$ {PIX_AMOUNT_DISPLAY}
                </span>
              </div>

              {/* Botão principal */}
              <button
                onClick={handleConfirmPayment}
                disabled={confirming}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-green-900/30 transition-all hover:bg-green-500 hover:shadow-green-700/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {confirming ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Unlock className="h-4 w-4" />
                    Já paguei — Liberar acesso
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-zinc-600">
                Ao clicar, você declara ter realizado o pagamento de{" "}
                R$ {PIX_AMOUNT_DISPLAY} para o {PRODUCT_NAME}.
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé legal */}
        <p className="mt-6 text-center text-xs text-zinc-700">
          Este site é para fins educacionais. Problemas? Entre em contato pelo suporte.
        </p>
      </div>
    </div>
  )
}
