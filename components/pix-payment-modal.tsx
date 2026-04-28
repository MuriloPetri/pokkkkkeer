"use client"

import { useState } from "react"
import { Check, Copy, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface PixPaymentModalProps {
  pixKey: string
  amount: string
  productName: string
}

export function PixPaymentModal({ pixKey, amount, productName }: PixPaymentModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey)
    setCopied(true)
    toast.success("Chave PIX copiada!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-6 text-lg shadow-xl hover:scale-105 transition-all">
          Liberar Acesso Premium - R$ {amount}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-green-500">Pagamento via PIX</DialogTitle>
          <DialogDescription className="text-center text-zinc-400">
            Escaneie o QR Code ou copie a chave abaixo para liberar o {productName}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6 space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-2xl">
            {/* Placeholder para QR Code - Em produção usaria uma API de PIX Dinâmico */}
            <div className="w-48 h-48 bg-zinc-100 flex items-center justify-center rounded-lg border-2 border-dashed border-zinc-300">
              <QrCode className="w-32 h-32 text-zinc-900" />
            </div>
          </div>

          <div className="w-full space-y-2">
            <p className="text-sm font-medium text-zinc-400 text-center">Chave PIX (E-mail/CPF/Aleatória)</p>
            <div className="flex items-center space-x-2 bg-zinc-900 p-3 rounded-lg border border-zinc-800">
              <code className="flex-1 text-sm truncate text-green-400 font-mono">
                {pixKey}
              </code>
              <Button size="icon" variant="ghost" onClick={handleCopy} className="hover:bg-zinc-800">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-xs text-zinc-500 italic">
              * Após o pagamento, envie o comprovante para nosso suporte para liberação imediata.
            </p>
            <div className="text-2xl font-bold text-white">
              Total: R$ {amount}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
