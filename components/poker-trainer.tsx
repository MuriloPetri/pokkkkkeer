"use client"

import { useState, useEffect } from "react"
import {
  type Position,
  type Scenario,
  type TableSize,
  type Action,
  type MixedAction,
  POSITIONS_BY_TABLE,
  POSITION_LABELS,
  TABLE_SIZE_LABELS,
  getRangeForScenario,
  getActionLabel,
  getHandTip,
  getComboCount,
  isScenarioApplicable,
} from "@/lib/poker-ranges"
import { RangeChart } from "./range-chart"
import { PositionSelector } from "./position-selector"
import { ScenarioSelector } from "./scenario-selector"
import { RangeLegend } from "./range-legend"
import { TrainingMode } from "./training-mode"
import { TournamentConfig } from "./tournament-config"
import { LearnToPlay } from "./learn-to-play"
import { cn } from "@/lib/utils"
import { BookOpen, Crosshair, Users, X, Info, Trophy, GraduationCap } from "lucide-react"

type Tab = "chart" | "training" | "tournament" | "learn"

const TABLE_SIZES: TableSize[] = ["6max", "9max", "headsup"]

const ACTION_COLORS: Record<Action, string> = {
  raise:  'bg-[oklch(0.72_0.19_160)] text-[oklch(0.13_0.005_260)]',
  '3bet': 'bg-[oklch(0.75_0.15_55)] text-[oklch(0.13_0.005_260)]',
  call:   'bg-[oklch(0.6_0.15_250)] text-white',
  fold:   'bg-zinc-700 text-zinc-400',
}

const HAND_TYPE_LABEL: Record<string, string> = {
  pair: 'Par',
  suited: 'Suited',
  offsuit: 'Offsuit',
}

export function PokerTrainer() {
  const [tab, setTab] = useState<Tab>("chart")
  const [tableSize, setTableSize] = useState<TableSize>("6max")
  const [position, setPosition] = useState<Position>("BTN")
  const [scenario, setScenario] = useState<Scenario>("RFI")
  const [filterAction, setFilterAction] = useState<Action | null>(null)
  const [selectedHand, setSelectedHand] = useState<string | null>(null)

  // When table size changes, reset position to first valid one
  useEffect(() => {
    const validPositions = POSITIONS_BY_TABLE[tableSize]
    if (!validPositions.includes(position)) {
      setPosition(validPositions[0])
    }
  }, [tableSize, position])

  // If current scenario doesn't apply to the new position/tableSize, reset to RFI
  useEffect(() => {
    if (!isScenarioApplicable(position, scenario, tableSize)) {
      setScenario('RFI')
    }
  }, [position, scenario, tableSize])

  // Clear filter and selection when scenario/position changes
  useEffect(() => {
    setFilterAction(null)
    setSelectedHand(null)
  }, [position, scenario, tableSize])

  const range = getRangeForScenario(position, scenario, tableSize)

  // Extract selected hand info
  const rawAction = selectedHand ? (range[selectedHand] || 'fold') : null
  const selectedAction = typeof rawAction === 'string' 
    ? rawAction 
    : rawAction 
      ? rawAction.reduce((prev, curr) => curr.frequency > prev.frequency ? curr : prev).action
      : null
  
  const selectedType = selectedHand
    ? selectedHand.length === 2 ? 'pair' : selectedHand.endsWith('s') ? 'suited' : 'offsuit'
    : null

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
              <span className="text-lg font-black text-zinc-950 font-mono">P</span>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white">Pokerzin <span className="text-emerald-500 text-sm font-medium">GTO</span></h1>
              <p className="hidden text-[10px] uppercase tracking-widest text-zinc-500 sm:block">
                Advanced Preflop Trainer
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 rounded-xl border border-white/5 bg-zinc-900/50 p-1 shadow-inner">
            <button
              onClick={() => setTab("chart")}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all",
                tab === "chart"
                  ? "bg-emerald-500 text-zinc-950 shadow-md"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Tabelas</span>
            </button>
            <button
              onClick={() => setTab("training")}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all",
                tab === "training"
                  ? "bg-emerald-500 text-zinc-950 shadow-md"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Crosshair className="h-4 w-4" />
              <span className="hidden sm:inline">Treinar</span>
            </button>
            <button
              onClick={() => setTab("tournament")}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all",
                tab === "tournament"
                  ? "bg-emerald-500 text-zinc-950 shadow-md"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Torneio</span>
            </button>
            <button
              onClick={() => setTab("learn")}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all",
                tab === "learn"
                  ? "bg-emerald-500 text-zinc-950 shadow-md"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Aprender</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {tab === "chart" ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Sidebar Controls */}
            <aside className="lg:col-span-4 flex flex-col gap-6">
              {/* Table Configuration Card */}
              <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-6 shadow-xl backdrop-blur-sm">
                <div className="mb-6 flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-500" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Configuração</h3>
                </div>
                
                <div className="space-y-6">
                  {/* Table Size */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tamanho da Mesa</label>
                    <div className="grid grid-cols-3 gap-2">
                      {TABLE_SIZES.map((size) => (
                        <button
                          key={size}
                          onClick={() => setTableSize(size)}
                          className={cn(
                            "rounded-lg border py-2 text-xs font-bold transition-all",
                            tableSize === size
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                              : "border-white/5 bg-white/5 text-zinc-400 hover:border-zinc-700 hover:text-white"
                          )}
                        >
                          {TABLE_SIZE_LABELS[size]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <PositionSelector
                    selected={position}
                    onSelect={setPosition}
                    tableSize={tableSize}
                  />

                  <div className="h-px bg-white/5 w-full" />

                  <ScenarioSelector selected={scenario} onSelect={setScenario} position={position} tableSize={tableSize} />
                </div>
              </div>

              {/* Legend Card */}
              <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-6 shadow-xl backdrop-blur-sm">
                 <RangeLegend
                  range={range}
                  scenario={scenario}
                  filterAction={filterAction}
                  onFilterChange={setFilterAction}
                />
              </div>
            </aside>

            {/* Chart Area */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Main Grid Card */}
              <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5 shadow-2xl backdrop-blur-md">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-1 bg-emerald-500 rounded-full" />
                    <div>
                      <h2 className="text-lg font-black text-white">Grid de Estratégia</h2>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                        {POSITION_LABELS[position]} · {scenario === "RFI" ? "Raise First In" : scenario === "vs3Bet" ? "Defesa vs Open" : "vs 3-Bet"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {filterAction && (
                      <button
                        onClick={() => setFilterAction(null)}
                        className="flex items-center gap-1.5 rounded-full bg-zinc-800 px-3 py-1 text-[10px] font-bold text-zinc-400 hover:text-white transition-all hover:bg-zinc-700"
                      >
                        <X className="h-3 w-3" /> Limpar Filtro
                      </button>
                    )}
                    <div className="rounded-lg bg-zinc-950 px-3 py-1 text-[10px] font-mono text-zinc-500 border border-white/5">
                      {getComboCount(selectedHand || "AA")} Combos
                    </div>
                  </div>
                </div>

                <RangeChart
                  range={range}
                  scenario={scenario}
                  filterAction={filterAction}
                  highlightHand={selectedHand}
                  onHandClick={(hand) => setSelectedHand(selectedHand === hand ? null : hand)}
                />
              </div>

              {/* Selected Hand Detail Panel */}
              {selectedHand && selectedAction && selectedType && (
                <div className="rounded-2xl border-2 border-emerald-500/20 bg-zinc-900/80 p-5 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex items-center gap-5">
                      {/* Premium card look */}
                      <div className="flex h-20 w-16 flex-col items-center justify-center rounded-xl bg-zinc-950 border border-white/10 shadow-2xl ring-1 ring-white/5">
                        <span className="text-3xl font-black font-mono text-white tracking-tighter">{selectedHand}</span>
                        <div className="mt-1 h-1 w-6 rounded-full bg-emerald-500/40" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={cn("rounded-md px-3 py-1 text-[11px] font-black uppercase tracking-wider", ACTION_COLORS[selectedAction])}>
                            {getActionLabel(selectedAction, scenario)}
                          </span>
                          <span className="rounded-md bg-zinc-800 px-2 py-1 text-[10px] font-bold text-zinc-400">
                            {HAND_TYPE_LABEL[selectedType]}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                             {getComboCount(selectedHand)} combinações
                          </span>
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed max-w-xl font-medium">
                          {getHandTip(selectedHand, selectedAction, scenario)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedHand(null)}
                      className="shrink-0 rounded-full p-2 text-zinc-600 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Info Grid */}
              <div className="grid gap-6 sm:grid-cols-2">
                <InfoCard
                  icon={<Info className="h-4 w-4 text-emerald-500" />}
                  title="Fundamentos"
                  items={[
                    "Diagonal Principal: Pares (Pocket Pairs)",
                    "Acima da Diagonal: Mãos Suited (Mesmo naipe)",
                    "Abaixo da Diagonal: Mãos Offsuit (Naipes diferentes)",
                  ]}
                />
                <InfoCard
                   icon={<Users className="h-4 w-4 text-emerald-500" />}
                  title="Contexto de Mesa"
                  items={
                    tableSize === "9max"
                      ? [
                          "Mesa cheia exige ranges extremamente tight no UTG",
                          "Roubo de blinds é mais rentável do CO e BTN",
                          "Cuidado com 'cold 4-bets' de jogadores em EP",
                        ]
                      : tableSize === "headsup"
                        ? [
                            "Heads-up é sobre agressão constante",
                            "O BTN abre ~80-100% das mãos",
                            "O BB deve defender agressivamente com 3-bets",
                          ]
                        : [
                            "Posições iniciais (EP) = Conservador",
                            "Posições finais (LP) = Agressivo",
                            "SB vs BB é a batalha de ranges mais amplos",
                          ]
                  }
                />
              </div>
            </div>
          </div>
        ) : tab === "training" ? (
          <TrainingMode tableSize={tableSize} />
        ) : tab === "tournament" ? (
          <TournamentConfig />
        ) : (
          <LearnToPlay />
        )}
      </main>
    </div>
  )
}

function InfoCard({ title, items, icon }: { title: string; items: string[]; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-zinc-900/30 p-5 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-xs font-black uppercase tracking-widest text-white">{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-xs text-zinc-400 leading-snug">
            <div className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-500/50" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

