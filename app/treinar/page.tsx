import type { Metadata } from "next"
import { PokerTrainer } from "@/components/poker-trainer"

export const metadata: Metadata = {
  title: "Treinar Ranges Preflop",
  description: "Pratique suas decisoes preflop com tabelas de ranges interativas e modo de treino com feedback. Suporte para 6-Max, 9-Max e Heads-Up.",
}

export default function TreinarPage() {
  return <PokerTrainer />
}
