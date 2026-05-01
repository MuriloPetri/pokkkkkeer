import { useState, useCallback, useEffect } from "react"
import {
  type Position,
  type Scenario,
  type Action,
  type TableSize,
  type MixedAction,
  POSITIONS_BY_TABLE,
  POSITION_LABELS,
  SCENARIO_LABELS,
  TABLE_SIZE_LABELS,
  getRandomHand,
  getRangeForScenario,
  getActionLabel,
  getActionColor,
  getActionTextColor,
  getHandType,
} from "@/lib/poker-ranges"
import { cn } from "@/lib/utils"
import { RotateCcw, Check, X, Trophy, Target, Zap, Settings2, Palette } from "lucide-react"

type CardTheme = 'classic' | 'dark' | 'neon' | 'minimal'

interface TrainingResult {
  hand: string
  position: Position
  scenario: Scenario
  correctAction: MixedAction
  userAction: Action
  isCorrect: boolean
}

interface TrainingModeProps {
  tableSize: TableSize
}

export function TrainingMode({ tableSize }: TrainingModeProps) {
  const positions = POSITIONS_BY_TABLE[tableSize]
  const [position, setPosition] = useState<Position>(positions[0])
  const [scenario, setScenario] = useState<Scenario>("RFI")
  const [currentHand, setCurrentHand] = useState(() => getRandomHand())
  const [results, setResults] = useState<TrainingResult[]>([])
  const [showFeedback, setShowFeedback] = useState<{ correct: boolean; action: MixedAction } | null>(null)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [cardTheme, setCardTheme] = useState<CardTheme>('classic')
  const [showConfig, setShowConfig] = useState(false)

  // Reset position when table size changes
  useEffect(() => {
    if (!positions.includes(position)) {
      setPosition(positions[0])
    }
  }, [tableSize, positions, position])

  const correctAction = getRangeForScenario(position, scenario, tableSize)[currentHand.label] || "fold"

  const getAvailableActions = useCallback((): Action[] => {
    if (scenario === "RFI") return ["raise", "fold"]
    if (scenario === "vs3Bet") return ["3bet", "call", "fold"]
    return ["raise", "call", "fold"]
  }, [scenario])

  const nextHand = useCallback(() => {
    setCurrentHand(getRandomHand())
    setShowFeedback(null)
  }, [])

  const handleAnswer = useCallback(
    (action: Action) => {
      let isCorrect = false
      if (typeof correctAction === 'string') {
        isCorrect = action === correctAction
      } else {
        isCorrect = correctAction.some(ma => ma.action === action && ma.frequency > 0)
      }

      const result: TrainingResult = {
        hand: currentHand.label,
        position,
        scenario,
        correctAction,
        userAction: action,
        isCorrect,
      }

      setResults((prev) => [result, ...prev].slice(0, 50))
      setShowFeedback({ correct: isCorrect, action: correctAction })

      if (isCorrect) {
        setStreak((prev) => {
          const newStreak = prev + 1
          setBestStreak((best) => Math.max(best, newStreak))
          return newStreak
        })
      } else {
        setStreak(0)
      }

      setTimeout(() => {
        nextHand()
      }, 1500)
    },
    [correctAction, currentHand.label, position, scenario, nextHand]
  )

  const resetStats = () => {
    setResults([])
    setStreak(0)
    setBestStreak(0)
  }

  const totalAnswered = results.length
  const totalCorrect = results.filter((r) => r.isCorrect).length
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0

  const handType = getHandType(currentHand.row, currentHand.col)
  const handTypeLabel = handType === "pair" ? "Par" : handType === "suited" ? "Suited" : "Offsuit"

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      {/* Training Header/Selectors */}
      <div className="flex flex-col gap-4">
        {/* Header with info */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
           <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-tighter">Sessão de Treino</h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Aprimore sua estratégia pre-flop</p>
              </div>
           </div>

           <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <Palette className="h-3.5 w-3.5 text-zinc-500" />
                <div className="flex items-center gap-1 rounded-lg bg-zinc-900/50 p-1 border border-white/5">
                  {(['classic', 'dark', 'neon', 'minimal'] as CardTheme[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setCardTheme(t)}
                      className={cn(
                        "rounded-md px-2 py-1 text-[8px] font-black uppercase tracking-widest transition-all",
                        cardTheme === t ? "bg-emerald-500 text-zinc-950" : "text-zinc-500 hover:text-white"
                      )}
                    >
                      {t[0]}
                    </button>
                  ))}
                </div>
             </div>
             <button
               onClick={resetStats}
               className="text-[10px] font-bold text-zinc-600 hover:text-red-500 transition-colors uppercase tracking-widest"
             >
               Resetar
             </button>
           </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          {/* Position Selector */}
          <div className="flex items-center gap-1 rounded-xl border border-white/5 bg-zinc-900/40 p-1 shadow-inner">
            {positions.map((pos) => (
              <button
                key={pos}
                onClick={() => setPosition(pos)}
                className={cn(
                  "rounded-lg px-4 py-2 text-[10px] font-black transition-all uppercase tracking-tight",
                  position === pos
                    ? "bg-emerald-500 text-zinc-950 shadow-md"
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                )}
              >
                {pos}
              </button>
            ))}
          </div>

          {/* Scenario Selector */}
          <div className="flex items-center gap-1 rounded-xl border border-white/5 bg-zinc-900/40 p-1 shadow-inner">
            {(["RFI", "vs3Bet", "facing3Bet"] as Scenario[]).map((s) => (
              <button
                key={s}
                onClick={() => setScenario(s)}
                className={cn(
                  "rounded-lg px-4 py-2 text-[10px] font-black transition-all uppercase tracking-tight",
                  scenario === s
                    ? "bg-emerald-500 text-zinc-950 shadow-md"
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                )}
              >
                {s === "RFI" ? "RFI" : s === "vs3Bet" ? "Contra Raise" : "Contra 3-Bet"}
              </button>
            ))}
          </div>
        </div>
      </div>


      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={<RotateCcw className="h-3 w-3" />} label="Respondidas" value={totalAnswered} />
        <StatCard icon={<Check className="h-3 w-3" />} label="Acertos" value={totalCorrect} />
        <StatCard
          icon={<Zap className="h-3 w-3" />}
          label="Precisão"
          value={`${accuracy}%`}
          highlight={accuracy >= 80 && totalAnswered > 0}
          color="emerald"
        />
        <StatCard
          icon={<Trophy className="h-3 w-3" />}
          label="Sequência"
          value={streak}
          subValue={`Best: ${bestStreak}`}
          highlight={streak >= 5}
          color="orange"
        />
      </div>

      {/* Main Training Area */}
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border-2 bg-zinc-900/40 p-8 shadow-2xl transition-all duration-500 backdrop-blur-md",
          showFeedback === null
            ? "border-white/5"
            : showFeedback.correct
              ? "border-emerald-500/50 shadow-emerald-500/10"
              : "border-red-500/50 shadow-red-500/10"
        )}
      >
        {/* Feedback Overlay */}
        {showFeedback && (
          <div
            className={cn(
              "absolute inset-0 z-10 flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm",
              "animate-in zoom-in-95 fade-in duration-300"
            )}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              {showFeedback.correct ? (
                <>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20">
                    <Check className="h-10 w-10 text-zinc-950" strokeWidth={3} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white uppercase tracking-tighter">Boa Jogada!</p>
                    <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest mt-1">Acertou a decisão</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500 shadow-lg shadow-red-500/20">
                    <X className="h-10 w-10 text-white" strokeWidth={3} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white uppercase tracking-tighter">Ops, Errou!</p>
                    <div className="mt-2 flex flex-col items-center gap-1">
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">A decisão correta era:</p>
                      <div className="flex gap-2">
                        {typeof showFeedback.action === 'string' ? (
                           <span className={cn("rounded-lg px-3 py-1 text-xs font-black uppercase", getActionColor(showFeedback.action), getActionTextColor(showFeedback.action))}>
                            {getActionLabel(showFeedback.action, scenario)}
                          </span>
                        ) : (
                          showFeedback.action.filter(ma => ma.frequency > 0).map((ma, i) => (
                             <span key={i} className={cn("rounded-lg px-3 py-1 text-xs font-black uppercase", getActionColor(ma.action), getActionTextColor(ma.action))}>
                               {getActionLabel(ma.action, scenario)} ({Math.round(ma.frequency * 100)}%)
                             </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Hand Display */}
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-wrap justify-center items-center gap-2">
            <span className="rounded-full bg-white/5 border border-white/5 px-3 py-1 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              {POSITION_LABELS[position]}
            </span>
            <span className="rounded-full bg-white/5 border border-white/5 px-3 py-1 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              {SCENARIO_LABELS[scenario]}
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <HandCard rank={currentHand.label[0]} suit="spade" theme={cardTheme} />
            <HandCard
              rank={currentHand.label[1]}
              suit={handType === "pair" ? "diamond" : handType === "suited" ? "spade" : "heart"}
              theme={cardTheme}
            />
          </div>

          <div className="flex flex-col items-center gap-1">
             <p className="text-2xl font-black text-white font-mono tracking-tighter uppercase">{currentHand.label}</p>
             <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{handTypeLabel}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex w-full max-w-md gap-4">
            {getAvailableActions().map((action) => (
              <button
                key={action}
                onClick={() => handleAnswer(action)}
                disabled={showFeedback !== null}
                className={cn(
                  "flex-1 rounded-2xl py-4 text-xs font-black uppercase tracking-widest transition-all duration-200",
                  getActionColor(action),
                  getActionTextColor(action),
                  "hover:brightness-110 hover:scale-[1.05] active:scale-[0.95] shadow-lg",
                  "disabled:opacity-50 disabled:pointer-events-none"
                )}
              >
                {getActionLabel(action, scenario)}
              </button>
            ))}
          </div>

          <button
            onClick={nextHand}
            disabled={showFeedback !== null}
            className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-white transition-all uppercase tracking-widest"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Pular Mão
          </button>
        </div>
      </div>

      {/* Recent History Grid */}
      {results.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Histórico da Sessão</h3>
            <button
              onClick={resetStats}
              className="text-[10px] font-bold text-zinc-600 hover:text-red-500 transition-colors uppercase tracking-widest"
            >
              Resetar Stats
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-10 md:grid-cols-12">
            {results.slice(0, 24).map((result, i) => (
              <div
                key={i}
                className={cn(
                  "flex h-10 flex-col items-center justify-center rounded-lg border text-[10px] font-black font-mono transition-all",
                  result.isCorrect
                    ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-500"
                    : "border-red-500/20 bg-red-500/5 text-red-500"
                )}
              >
                {result.hand}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  subValue,
  highlight,
  icon,
  color = "zinc"
}: {
  label: string
  value: string | number
  subValue?: string
  highlight?: boolean
  icon?: React.ReactNode
  color?: "zinc" | "emerald" | "orange"
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-2xl border border-white/5 bg-zinc-900/40 p-4 shadow-lg backdrop-blur-sm",
        highlight && color === "emerald" && "border-emerald-500/30 bg-emerald-500/5",
        highlight && color === "orange" && "border-orange-500/30 bg-orange-500/5",
      )}
    >
      <div className="flex items-center gap-1.5 opacity-50">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-baseline gap-2 mt-1">
        <span
          className={cn(
            "text-2xl font-black font-mono tracking-tighter",
            highlight && color === "emerald" ? "text-emerald-500" : 
            highlight && color === "orange" ? "text-orange-500" : "text-white"
          )}
        >
          {value}
        </span>
        {subValue && <span className="text-[9px] font-bold text-zinc-500 uppercase">{subValue}</span>}
      </div>
    </div>
  )
}

function HandCard({ rank, suit, theme }: { rank: string; suit: "spade" | "heart" | "diamond" | "club"; theme: CardTheme }) {
  const suitSymbol = suit === "spade" ? "\u2660" : suit === "heart" ? "\u2665" : suit === "diamond" ? "\u2666" : "\u2663"
  const isRed = suit === "heart" || suit === "diamond"

  const styles = {
    classic: {
      card: "bg-white border-zinc-200 text-zinc-950 shadow-xl",
      rank: isRed ? "text-red-600" : "text-zinc-900",
      suit: isRed ? "text-red-600" : "text-zinc-900",
    },
    dark: {
      card: "bg-zinc-950 border-white/10 text-white shadow-2xl ring-1 ring-white/5",
      rank: isRed ? "text-red-500" : "text-white",
      suit: isRed ? "text-red-500" : "text-white",
    },
    neon: {
      card: cn(
        "bg-black shadow-2xl transition-all",
        isRed ? "border-red-500/50 shadow-red-500/20" : "border-emerald-500/50 shadow-emerald-500/20"
      ),
      rank: cn("font-black drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]", isRed ? "text-red-500" : "text-emerald-500"),
      suit: cn("drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]", isRed ? "text-red-500" : "text-emerald-500"),
    },
    minimal: {
      card: "bg-transparent border-white/5",
      rank: "text-white opacity-40",
      suit: "text-white scale-150 drop-shadow-lg",
    }
  }[theme]

  return (
    <div className={cn(
      "flex h-28 w-20 flex-col items-center justify-center gap-1 rounded-2xl border transition-all duration-300 sm:h-36 sm:w-26 sm:p-4",
      styles.card
    )}>
      <span className={cn("text-3xl font-black font-mono leading-none sm:text-5xl", styles.rank)}>
        {rank}
      </span>
      
      <span className={cn("text-2xl sm:text-4xl opacity-90", styles.suit)}>
        {suitSymbol}
      </span>
    </div>
  )
}


