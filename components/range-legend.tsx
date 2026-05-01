"use client"

import { type Action, type Scenario, getActionLabel, getRangeStats, getRangeComboStats } from "@/lib/poker-ranges"
import { cn } from "@/lib/utils"

interface RangeLegendProps {
  range: Record<string, Action>
  scenario: Scenario
  filterAction?: Action | null
  onFilterChange?: (action: Action | null) => void
}

const LEGEND_ITEMS: { action: Action; bgClass: string; textClass: string; borderClass: string }[] = [
  { action: 'raise', bgClass: 'bg-[oklch(0.72_0.19_160)]', textClass: 'text-[oklch(0.13_0.005_260)]', borderClass: 'border-[oklch(0.6_0.19_160)]' },
  { action: '3bet',  bgClass: 'bg-[oklch(0.75_0.15_55)]',  textClass: 'text-[oklch(0.13_0.005_260)]', borderClass: 'border-[oklch(0.6_0.15_55)]' },
  { action: 'call',  bgClass: 'bg-[oklch(0.6_0.15_250)]',  textClass: 'text-[oklch(0.95_0_0)]',       borderClass: 'border-[oklch(0.5_0.15_250)]' },
  { action: 'fold',  bgClass: 'bg-[oklch(0.25_0.01_260)]', textClass: 'text-[oklch(0.5_0_0)]',        borderClass: 'border-zinc-600' },
]

export function RangeLegend({ range, scenario, filterAction, onFilterChange }: RangeLegendProps) {
  const stats = getRangeStats(range)
  const comboStats = getRangeComboStats(range)
  const totalCombos = 1326
  const totalHands = 169

  const relevantItems = LEGEND_ITEMS.filter((item) => {
    if (scenario === 'RFI') return item.action === 'raise' || item.action === 'fold'
    return true
  }).filter((item) => stats[item.action] > 0)

  const handleClick = (action: Action) => {
    onFilterChange?.(filterAction === action ? null : action)
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-zinc-300">Legenda das Ações</h3>

      {/* Filterable action buttons */}
      <div className="flex flex-wrap gap-2">
        {relevantItems.map(({ action, bgClass, textClass, borderClass }) => {
          const isActive = filterAction === action
          const handCount = stats[action]
          const comboCount = comboStats[action]
          const handPct = Math.round((handCount / totalHands) * 100)
          const comboPct = Math.round((comboCount / totalCombos) * 100)

          return (
            <button
              key={action}
              onClick={() => handleClick(action)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-all duration-150",
                "hover:scale-[1.03] active:scale-[0.97]",
                isActive
                  ? `${bgClass} ${textClass} ${borderClass} shadow-lg ring-2 ring-offset-1 ring-offset-zinc-950 ring-white/20`
                  : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-600"
              )}
            >
              {/* Color dot */}
              <div className={cn("h-2.5 w-2.5 rounded-sm shrink-0", bgClass)} />

              <div className="flex flex-col">
                <span className={cn(
                  "text-xs font-semibold leading-tight",
                  isActive ? textClass : "text-zinc-200"
                )}>
                  {getActionLabel(action, scenario)}
                </span>
                <span className={cn(
                  "text-[10px] leading-tight",
                  isActive ? textClass : "text-zinc-500"
                )}>
                  {handCount} mãos ({handPct}%) · {comboPct}% combos
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Visual combo bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-zinc-600">
          <span>Distribuição de combos</span>
          <span>{totalCombos} combos totais</span>
        </div>
        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
          {relevantItems.map(({ action, bgClass }) => (
            <div
              key={action}
              className={cn(bgClass, "transition-all duration-500",
                filterAction && filterAction !== action && "opacity-20"
              )}
              style={{ width: `${(comboStats[action] / totalCombos) * 100}%` }}
            />
          ))}
        </div>
      </div>

      {/* Hint */}
      <p className="text-[10px] text-zinc-600 leading-snug">
        Clique em uma ação para destacar as mãos no grid.
        <br />Clique novamente para remover o filtro.
      </p>
    </div>
  )
}
