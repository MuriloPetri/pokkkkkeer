"use client"
import { useState } from "react"
import { BookOpen, ChevronRight, ChevronLeft, CheckCircle, Circle, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface Lesson {
  id: string
  title: string
  emoji: string
  sections: { heading: string; content: string; tip?: string }[]
}

const LESSONS: Lesson[] = [
  {
    id: "goal",
    title: "Objetivo do Poker",
    emoji: "🎯",
    sections: [
      { heading: "O que é Poker?", content: "Poker é um jogo de cartas onde você compete contra outros jogadores para ganhar as fichas do pote. Vence quem tiver a melhor combinação de 5 cartas — ou quem convencer os adversários a desistir (fold)." },
      { heading: "Texas Hold'em", content: "O formato mais popular. Cada jogador recebe 2 cartas secretas (hole cards). Depois, 5 cartas comunitárias são reveladas progressivamente: Flop (3 cartas), Turn (1 carta), River (1 carta). Você usa qualquer combinação das suas 2 + as 5 do centro para formar sua melhor mão de 5 cartas." },
      { heading: "Como vencer?", content: "Você pode ganhar de duas formas: (1) Tendo a melhor mão no showdown ao final, ou (2) Fazendo todos os outros jogadores darem fold nas suas apostas antes do showdown.", tip: "Saber quando blefar é tão importante quanto ter boas cartas!" },
    ],
  },
  {
    id: "hands",
    title: "Ranking das Mãos",
    emoji: "🃏",
    sections: [
      { heading: "Do mais forte ao mais fraco", content: "1. Royal Flush: A K Q J T do mesmo naipe\n2. Straight Flush: 5 cartas consecutivas do mesmo naipe\n3. Quadra (Four of a Kind): 4 cartas iguais\n4. Full House: Trinca + Par\n5. Flush: 5 do mesmo naipe\n6. Sequência (Straight): 5 consecutivas\n7. Trinca (Three of a Kind): 3 iguais\n8. Dois Pares\n9. Um Par\n10. Carta Alta (High Card)" },
      { heading: "Na prática", content: "Royal Flush e Straight Flush são raríssimos. A maioria das mãos termina com Um Par, Dois Pares ou Trinca. Aprender a identificar rapidamente qual mão você tem é essencial.", tip: "Decore a ordem! Em torneios você precisa avaliar sua mão em segundos." },
    ],
  },
  {
    id: "positions",
    title: "Posições na Mesa",
    emoji: "🗺️",
    sections: [
      { heading: "Por que posição importa?", content: "Posição é um dos conceitos mais poderosos do poker. Quem age por último tem VANTAGEM — vê o que os outros fizeram antes de decidir. Mais informação = melhores decisões." },
      { heading: "As Posições (mesa 6 jogadores)", content: "UTG (Under The Gun): Age primeiro — posição mais difícil, jogue menos mãos.\nMP (Middle Position): Intermediário.\nCO (Cutoff): Boa posição, pode abrir mais.\nBTN (Button): MELHOR posição — age por último no flop/turn/river.\nSB (Small Blind): Age antes do BB mas depois de todos pré-flop.\nBB (Big Blind): Age por último pré-flop, mas primeiro pós-flop." },
      { heading: "Regra Prática", content: "No BTN você pode jogar muito mais mãos. No UTG seja muito seletivo. Quanto mais tarde sua posição, mais mãos você pode jogar com lucro.", tip: "BTN é o rei da mesa. Aproveite cada vez que estiver no botão!" },
    ],
  },
  {
    id: "actions",
    title: "As Ações do Jogo",
    emoji: "✋",
    sections: [
      { heading: "Fold (Desistir)", content: "Você joga fora suas cartas e desiste do pote. Não perde mais fichas, mas perde as que já apostou. Foldar mãos ruins é uma das habilidades mais importantes!" },
      { heading: "Check (Passar)", content: "Quando não há aposta anterior, você pode 'passar' sem apostar. A ação vai para o próximo jogador. Só disponível se ninguém apostou ainda." },
      { heading: "Call (Pagar/Igualar)", content: "Você iguala a aposta do adversário. Continua na mão pagando o mesmo valor que foi apostado." },
      { heading: "Raise (Aumentar)", content: "Você aumenta a aposta. Força os adversários a pagar mais para continuar. Pode ser feito por valor (mão boa) ou como blefe." },
      { heading: "All-In", content: "Você aposta todas as suas fichas. Pode ser por valor máximo ou desespero. Em torneios, all-in é comum com stacks curtos.", tip: "Nunca faça all-in por raiva ou emoção. Sempre tenha uma razão estratégica." },
    ],
  },
  {
    id: "preflop",
    title: "Estratégia Pré-flop Básica",
    emoji: "📊",
    sections: [
      { heading: "O que é pré-flop?", content: "Pré-flop é a rodada antes das cartas comunitárias aparecerem. Você só tem suas 2 cartas secretas. Esta é a decisão mais repetida no poker — acerte aqui e já tem vantagem." },
      { heading: "Mãos Iniciadoras Fortes", content: "PREMIUM (sempre abra): AA, KK, QQ, JJ, AKs, AKo\nFORTES (geralmente abra): TT, 99, AQs, AQo, AJs, KQs\nESPECULATIVAS (abra em posição): 77-22, connectors suited (T9s, 87s)\nFRACAS (evite, especialmente fora de posição): mãos como 72o, 83o, J4o" },
      { heading: "Regra de Ouro", content: "Em posição inicial: jogue poucas mãos, apenas as muito fortes. No botão: pode jogar até 40-50% das mãos. Sempre considere sua posição antes de olhar para as cartas.", tip: "Iniciantes devem jogar apenas as top 20% de mãos. Disciplina > quantidade de mãos jogadas." },
    ],
  },
  {
    id: "potodds",
    title: "Pot Odds & Equity",
    emoji: "📐",
    sections: [
      { heading: "O que são Pot Odds?", content: "Pot odds é a relação entre o tamanho do pote e o quanto você precisa pagar para continuar. Se o pote tem R$100 e você precisa pagar R$25, seus pot odds são 4:1 (ou 20%)." },
      { heading: "Como usar?", content: "Compare seus pot odds com suas chances de ganhar (equity).\n\nExemplo: Você tem 4 cartas para um flush (outs = 9 cartas). No turn, você tem ~19% de chance de completar no river.\n\nSe o adversário aposta R$30 num pote de R$100, você paga R$30 para ganhar R$130 → precisa de 19% equity. Você tem exatamente 19% → é um call break-even. Se tiver qualquer vantagem extra, é um call lucrativo!" },
      { heading: "Regra dos Outs", content: "Flop (2 cartas sobrando): outs × 4 = % aproximada de equity\nTurn (1 carta sobrando): outs × 2 = % aproximada de equity\n\nExemplos de outs:\n- Flush draw: 9 outs\n- Straight draw aberta: 8 outs\n- Par melhorando para trinca: 2 outs", tip: "Não precisa calcular exatamente — aprenda as aproximações e use no calor do jogo!" },
    ],
  },
  {
    id: "bluff",
    title: "Quando Blefar",
    emoji: "🎭",
    sections: [
      { heading: "O que é blefe?", content: "Blefe é apostar ou aumentar com uma mão fraca para fazer o adversário desistir (fold). Não é mentira — é estratégia. O poker seria previsível sem blefes." },
      { heading: "Blefe Bom vs Blefe Ruim", content: "BOM: Você tem equity (ex: flush draw) — chamado de semi-blefe. Se o adversário fizer fold, você ganha o pote. Se ele chamar, ainda pode completar a mão.\n\nRUIM: Blefar sem motivo, sem equity, contra jogadores que nunca fazem fold (call stations). Isso é jogar fora fichas." },
      { heading: "Quando blefar faz sentido?", content: "1. Você está em posição (age por último)\n2. O board (cartas comunitárias) favorece seu range\n3. O adversário mostrou fraqueza (checkando)\n4. O tamanho da sua aposta faz sentido com uma mão forte\n5. Você tem histórico de apostas que justifica força", tip: "Iniciantes devem blefar MENOS, não mais. Primeiro aprenda a ganhar com valor, depois com blefes." },
    ],
  },
  {
    id: "tournament",
    title: "Poker em Torneio",
    emoji: "🏆",
    sections: [
      { heading: "Como funciona um torneio?", content: "Todo mundo começa com o mesmo stack. Os blinds aumentam com o tempo, forçando ação. Você é eliminado quando perde todas as fichas. Ganha quem sobrar (ou prêmios são pagos aos últimos colocados)." },
      { heading: "Diferenças do Cash Game", content: "No torneio, fichas perdidas não voltam. Sobreviver tem valor — especialmente perto da bolha (quando os jogadores começam a receber prêmio). Stack pequeno = menos opções estratégicas." },
      { heading: "ICM (Independent Chip Model)", content: "No torneio, fichas não têm valor linear. Dobrar seu stack não dobra seu prêmio esperado. Ficar vivo vale muito — especialmente na bolha. Portanto, às vezes é correto fazer um fold matematicamente neutro para sobreviver e garantir prêmio.", tip: "Use a aba 'Torneio' desta plataforma para analisar sua situação atual em tempo real!" },
    ],
  },
]

export function LearnToPlay() {
  const [activeLesson, setActiveLesson] = useState(0)
  const [activePage, setActivePage] = useState(0)
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  const lesson = LESSONS[activeLesson]
  const page = lesson.sections[activePage]
  const isLastPage = activePage === lesson.sections.length - 1

  function markComplete() {
    setCompleted((prev) => new Set([...prev, lesson.id]))
  }

  function nextPage() {
    if (isLastPage) {
      markComplete()
      if (activeLesson < LESSONS.length - 1) { setActiveLesson(a => a + 1); setActivePage(0) }
    } else {
      setActivePage(p => p + 1)
    }
  }

  function prevPage() {
    if (activePage > 0) setActivePage(p => p - 1)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
          <BookOpen className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white">Escola de Poker</h2>
          <p className="text-xs text-zinc-500">{completed.size}/{LESSONS.length} lições concluídas</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-zinc-800">
        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${(completed.size / LESSONS.length) * 100}%` }} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-1">
          {LESSONS.map((l, i) => (
            <button
              key={l.id}
              onClick={() => { setActiveLesson(i); setActivePage(0) }}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all",
                activeLesson === i
                  ? "bg-emerald-500/15 border border-emerald-500/30"
                  : "hover:bg-white/5 border border-transparent"
              )}
            >
              <span className="text-xl shrink-0">{l.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-bold truncate", activeLesson === i ? "text-white" : "text-zinc-400")}>
                  {l.title}
                </p>
                <p className="text-[10px] text-zinc-600">{l.sections.length} seções</p>
              </div>
              {completed.has(l.id)
                ? <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                : <Circle className="h-4 w-4 text-zinc-700 shrink-0" />
              }
            </button>
          ))}
        </aside>

        {/* Content */}
        <div className="lg:col-span-8 space-y-4">
          {/* Lesson header */}
          <div className="rounded-2xl border border-white/5 bg-zinc-900/60 px-6 py-5">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">{lesson.emoji}</span>
              <h3 className="text-xl font-black text-white">{lesson.title}</h3>
              {completed.has(lesson.id) && (
                <span className="ml-auto text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">✓ Concluída</span>
              )}
            </div>
            {/* Section tabs */}
            <div className="flex gap-1 mt-4 flex-wrap">
              {lesson.sections.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActivePage(i)}
                  className={cn(
                    "text-[10px] font-bold px-3 py-1 rounded-full transition-all",
                    activePage === i ? "bg-emerald-500 text-zinc-950" : "bg-zinc-800 text-zinc-400 hover:text-white"
                  )}
                >
                  {i + 1}. {s.heading.length > 20 ? s.heading.slice(0, 18) + "…" : s.heading}
                </button>
              ))}
            </div>
          </div>

          {/* Content card */}
          <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-6 space-y-5">
            <h4 className="text-base font-black text-white">{page.heading}</h4>
            <div className="space-y-3">
              {page.content.split("\n").map((line, i) => (
                line.trim() ? (
                  <p key={i} className={cn(
                    "text-sm leading-relaxed",
                    line.match(/^\d\./) ? "font-bold text-zinc-200" : "text-zinc-300"
                  )}>
                    {line}
                  </p>
                ) : <div key={i} className="h-2" />
              ))}
            </div>
            {page.tip && (
              <div className="flex items-start gap-2.5 rounded-xl border border-yellow-500/20 bg-yellow-950/20 p-4">
                <Star className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-200 leading-relaxed">{page.tip}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevPage}
              disabled={activePage === 0}
              className="flex items-center gap-2 rounded-xl border border-white/5 bg-zinc-900 px-4 py-2 text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </button>
            <span className="text-xs text-zinc-600">{activePage + 1} / {lesson.sections.length}</span>
            <button
              onClick={nextPage}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all",
                isLastPage
                  ? "bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
                  : "border border-white/5 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
              )}
            >
              {isLastPage ? "✓ Concluir lição" : "Próximo"} <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
