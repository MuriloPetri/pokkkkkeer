"use client"

import { useState, useCallback, useEffect } from "react"
import {
  type Position,
  type Scenario,
  type Action,
  type TableSize,
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
import { RotateCcw, Check, X } from "lucide-react"

interface TrainingResult {
  hand: string
  position: Position
  scenario: Scenario
  correctAction: Action
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
  const [showFeedback, setShowFeedback] = useState<{ correct: boolean; action: Action } | null>(null)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  // Reset position when table size changes
  useEffect(() => {
    if (!positions.includes(position)) {
      setPosition(positions[0])
    }
  }, [tableSize, positions, position])

  const range = getRangeForScenario(position, scenario, tableSize)
  const correctAction = range[currentHand.label] || "fold"

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
      const isCorrect = action === correctAction
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
  const handTypeLabel = handType === "pair" ? "Par" : handType === "suited" ? "Do mesmo naipe" : "Naipes diferentes"

  return (
    <div className="flex flex-col gap-6">
      {/* Training Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Position Quick Select */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-secondary/30 p-1">
          {positions.map((pos) => (
            <button
              key={pos}
              onClick={() => setPosition(pos)}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-xs font-mono font-medium transition-all",
                position === pos
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {pos}
            </button>
          ))}
        </div>

        {/* Scenario Quick Select */}
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/30 p-1">
          {(["RFI", "vs3Bet", "facing3Bet"] as Scenario[]).map((s) => (
            <button
              key={s}
              onClick={() => setScenario(s)}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-xs font-medium transition-all",
                scenario === s
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {s === "RFI" ? "RFI" : s === "vs3Bet" ? "Contra Raise" : "Contra 3-Bet"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Respondidas" value={totalAnswered} />
        <StatCard label="Acertos" value={totalCorrect} />
        <StatCard
          label="Precisao"
          value={`${accuracy}%`}
          highlight={accuracy >= 80}
        />
        <StatCard
          label="Sequencia"
          value={streak}
          subValue={`Recorde: ${bestStreak}`}
          highlight={streak >= 5}
        />
      </div>

      {/* Main Training Card */}
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border-2 bg-card p-6 transition-all duration-300",
          showFeedback === null
            ? "border-border"
            : showFeedback.correct
              ? "border-[oklch(0.72_0.19_160)]"
              : "border-destructive"
        )}
      >
        {/* Feedback Overlay */}
        {showFeedback && (
          <div
            className={cn(
              "absolute inset-0 z-10 flex items-center justify-center bg-card/90 backdrop-blur-sm",
              "animate-in fade-in duration-200"
            )}
          >
            <div className="flex flex-col items-center gap-2">
              {showFeedback.correct ? (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[oklch(0.72_0.19_160)]">
                    <Check className="h-6 w-6 text-[oklch(0.13_0.005_260)]" />
                  </div>
                  <p className="text-lg font-bold text-foreground">Acertou!</p>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive">
                    <X className="h-6 w-6 text-destructive-foreground" />
                  </div>
                  <p className="text-lg font-bold text-foreground">Errou</p>
                  <p className="text-sm text-muted-foreground">
                    A jogada certa era:{" "}
                    <span className="font-bold text-foreground">
                      {getActionLabel(showFeedback.action, scenario)}
                    </span>
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Hand Display */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-secondary px-2 py-1 text-xs font-mono text-muted-foreground">
              {POSITION_LABELS[position]}
            </span>
            <span className="rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground">
              {SCENARIO_LABELS[scenario]}
            </span>
            <span className="rounded-md bg-secondary px-2 py-1 text-xs font-mono text-muted-foreground">
              {TABLE_SIZE_LABELS[tableSize]}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <HandCard rank={currentHand.label[0]} suited={handType === "suited" || handType === "pair"} suit={handType === "suited" ? "spade" : "heart"} />
            <HandCard
              rank={currentHand.label[1]}
              suited={handType === "suited" || handType === "pair"}
              suit={handType === "pair" ? "diamond" : handType === "suited" ? "spade" : "diamond"}
            />
            {currentHand.label.length > 2 && (
              <span className="ml-1 text-sm font-mono text-muted-foreground">
                {currentHand.label[2] === "s" ? "(mesmo naipe)" : "(naipes dif.)"}
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground">{handTypeLabel}</p>

          {/* Action Buttons */}
          <div className="flex w-full max-w-md gap-3">
            {getAvailableActions().map((action) => (
              <button
                key={action}
                onClick={() => handleAnswer(action)}
                disabled={showFeedback !== null}
                className={cn(
                  "flex-1 rounded-lg py-3 text-sm font-bold uppercase tracking-wider transition-all",
                  getActionColor(action),
                  getActionTextColor(action),
                  "hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]",
                  "disabled:opacity-50 disabled:pointer-events-none"
                )}
              >
                {getActionLabel(action, scenario)}
              </button>
            ))}
          </div>

          <button
            onClick={nextHand}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Pular esta mao
          </button>
        </div>
      </div>

      {/* Recent Results */}
      {results.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Ultimas Jogadas</h3>
            <button
              onClick={resetStats}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Limpar tudo
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {results.slice(0, 20).map((result, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-mono",
                  result.isCorrect
                    ? "bg-[oklch(0.72_0.19_160/0.15)] text-[oklch(0.72_0.19_160)]"
                    : "bg-destructive/15 text-destructive"
                )}
              >
                {result.isCorrect ? (
                  <Check className="h-2.5 w-2.5" />
                ) : (
                  <X className="h-2.5 w-2.5" />
                )}
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
}: {
  label: string
  value: string | number
  subValue?: string
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-0.5 rounded-lg border border-border bg-secondary/30 px-3 py-2.5",
        highlight && "border-primary/50 bg-primary/5"
      )}
    >
      <span
        className={cn(
          "text-lg font-bold font-mono",
          highlight ? "text-primary" : "text-foreground"
        )}
      >
        {value}
      </span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
      {subValue && <span className="text-[9px] text-muted-foreground">{subValue}</span>}
    </div>
  )
}

function HandCard({ rank, suited, suit }: { rank: string; suited: boolean; suit: "spade" | "heart" | "diamond" | "club" }) {
  const suitSymbol = suit === "spade" ? "\u2660" : suit === "heart" ? "\u2665" : suit === "diamond" ? "\u2666" : "\u2663"
  const isRed = suit === "heart" || suit === "diamond"

  return (
    <div className="flex h-20 w-14 flex-col items-center justify-center rounded-lg border-2 border-border bg-foreground/95 shadow-lg sm:h-24 sm:w-16">
      <span className={cn("text-xl font-bold font-mono sm:text-2xl", isRed ? "text-destructive" : "text-background")}>
        {rank}
      </span>
      <span className={cn("text-lg sm:text-xl", isRed ? "text-destructive" : "text-background")}>
        {suitSymbol}
      </span>
    </div>
  )
}
