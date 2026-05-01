"use client"

import { useState, useEffect } from "react"
import {
  type Position,
  type Scenario,
  type TableSize,
  type Action,
  POSITIONS_BY_TABLE,
  TABLE_SIZE_LABELS,
  getRangeForScenario,
  getActionLabel,
  getHandTip,
  getComboCount,
} from "@/lib/poker-ranges"
import { RangeChart } from "./range-chart"
import { PositionSelector } from "./position-selector"
import { ScenarioSelector } from "./scenario-selector"
import { RangeLegend } from "./range-legend"
import { TrainingMode } from "./training-mode"
import { cn } from "@/lib/utils"
import { BookOpen, Crosshair, Users, X } from "lucide-react"

type Tab = "chart" | "training"

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

  // If UTG is selected and scenario is vs3Bet (not applicable), switch to RFI
  useEffect(() => {
    if (['UTG', 'UTG1', 'UTG2'].includes(position) && scenario === 'vs3Bet') {
      setScenario('RFI')
    }
  }, [position, scenario])

  // Clear filter and selection when scenario/position changes
  useEffect(() => {
    setFilterAction(null)
    setSelectedHand(null)
  }, [position, scenario, tableSize])

  const range = getRangeForScenario(position, scenario, tableSize)

  const selectedAction = selectedHand ? (range[selectedHand] || 'fold') : null
  const selectedType = selectedHand
    ? selectedHand.length === 2 ? 'pair' : selectedHand.endsWith('s') ? 'suited' : 'offsuit'
    : null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground font-mono">P</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Treinador de Poker</h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Range Charts Preflop e Treino
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/30 p-1">
            <button
              onClick={() => setTab("chart")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                tab === "chart"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Tabelas</span>
            </button>
            <button
              onClick={() => setTab("training")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                tab === "training"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Crosshair className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Treino</span>
            </button>
          </div>
        </div>
      </header>

      {/* Table Size Selector - Below header */}
      <div className="border-b border-border bg-card/60">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Mesa:</span>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/30 p-0.5">
            {TABLE_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setTableSize(size)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium transition-all",
                  tableSize === size
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {TABLE_SIZE_LABELS[size]}
              </button>
            ))}
          </div>
          <span className="hidden text-[11px] text-muted-foreground sm:inline">
            {POSITIONS_BY_TABLE[tableSize].length} jogadores na mesa
          </span>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {tab === "chart" ? (
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Sidebar */}
            <aside className="flex w-full flex-col gap-6 lg:w-72 lg:shrink-0">
              <PositionSelector
                selected={position}
                onSelect={setPosition}
                tableSize={tableSize}
              />
              <ScenarioSelector selected={scenario} onSelect={setScenario} position={position} />
              <RangeLegend
                range={range}
                scenario={scenario}
                filterAction={filterAction}
                onFilterChange={setFilterAction}
              />
            </aside>

            {/* Chart + Selected Hand Panel */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Chart header */}
              <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-medium text-foreground">
                    Tabela de Ranges — {position}
                  </h2>
                  <div className="flex items-center gap-2">
                    {filterAction && (
                      <button
                        onClick={() => setFilterAction(null)}
                        className="flex items-center gap-1 rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:text-white transition-colors"
                      >
                        <X className="h-2.5 w-2.5" /> Limpar filtro
                      </button>
                    )}
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                      {TABLE_SIZE_LABELS[tableSize]}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {scenario === "RFI"
                        ? "Abrir a Mão"
                        : scenario === "vs3Bet"
                          ? "Contra Raise"
                          : "Contra 3-Bet"}
                    </span>
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
                <div className="rounded-xl border border-zinc-700 bg-zinc-900/80 p-4 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {/* Big hand name */}
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-800 border border-zinc-700 shadow-inner">
                        <span className="text-2xl font-black font-mono text-white">{selectedHand}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn("rounded-md px-2 py-0.5 text-xs font-bold", ACTION_COLORS[selectedAction])}>
                            {getActionLabel(selectedAction, scenario)}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {HAND_TYPE_LABEL[selectedType]} · {getComboCount(selectedHand)} combos
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
                          {getHandTip(selectedHand, selectedAction, scenario)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedHand(null)}
                      className="shrink-0 rounded-lg p-1.5 text-zinc-600 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Info Section */}
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoCard
                  title="Como ler a tabela"
                  items={[
                    "Diagonal = pares (AA, KK, QQ...)",
                    "Acima da diagonal = suited (AKs, AQs...)",
                    "Abaixo da diagonal = offsuit (AKo, AQo...)",
                  ]}
                />
                <InfoCard
                  title="Dicas por formato de mesa"
                  items={
                    tableSize === "9max"
                      ? [
                          "9-max tem ranges mais apertados nas posições iniciais",
                          "LJ e HJ são posições intermediárias",
                          "BTN e SB continuam com ranges amplos",
                        ]
                      : tableSize === "headsup"
                        ? [
                            "Heads-up tem ranges muito mais amplos",
                            "BTN/SB abre quase tudo",
                            "BB defende amplo contra raises do BTN",
                          ]
                        : [
                            "Posições iniciais (UTG/MP) = ranges mais apertados",
                            "Posições finais (CO/BTN) = ranges mais amplos",
                            "Blinds (SB/BB) = defesa e ranges de 3-bet",
                          ]
                  }
                />
              </div>
            </div>
          </div>
        ) : (
          <TrainingMode tableSize={tableSize} />
        )}
      </main>
    </div>
  )
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-2 text-sm font-medium text-foreground">{title}</h3>
      <ul className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
