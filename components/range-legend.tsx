"use client"

import { 
  type Action, 
  type Scenario, 
  type MixedAction,
  getActionLabel, 
  getRangeStats, 
  getRangeComboStats,
  getActionColor,
  getActionTextColor
} from "@/lib/poker-ranges"
import { cn } from "@/lib/utils"

interface RangeLegendProps {
  range: Record<string, MixedAction>
  scenario: Scenario
  filterAction?: Action | null
  onFilterChange?: (action: Action | null) => void
}

const LEGEND_ACTIONS: Action[] = ['raise', '3bet', 'call', 'fold']

export function RangeLegend({ range, scenario, filterAction, onFilterChange }: RangeLegendProps) {
  const stats = getRangeStats(range)
  const comboStats = getRangeComboStats(range)
  const totalCombos = 1326
  const totalHands = 169

  const relevantActions = LEGEND_ACTIONS.filter((action) => {
    if (scenario === 'RFI') return action === 'raise' || action === 'fold'
    return true
  }).filter((action) => stats[action] > 0)

  const handleClick = (action: Action) => {
    onFilterChange?.(filterAction === action ? null : action)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Resumo da Estratégia</h3>
      </div>

      {/* Filterable action buttons */}
      <div className="grid grid-cols-1 gap-2">
        {relevantActions.map((action) => {
          const isActive = filterAction === action
          const handCount = stats[action]
          const comboCount = comboStats[action]
          const handPct = Math.round((handCount / totalHands) * 100)
          const comboPct = ((comboCount / totalCombos) * 100).toFixed(1)
          
          const colorClass = getActionColor(action)
          const textColor = getActionTextColor(action)

          return (
            <button
              key={action}
              onClick={() => handleClick(action)}
              className={cn(
                "group relative flex items-center justify-between overflow-hidden rounded-xl border p-3 transition-all duration-200",
                isActive
                  ? `${colorClass} ${textColor} border-transparent shadow-lg scale-[1.02]`
                  : "border-white/5 bg-zinc-950/50 hover:border-zinc-700"
              )}
            >
              <div className="flex items-center gap-3">
                {/* Visual Indicator */}
                <div className={cn(
                  "h-8 w-1 rounded-full",
                  isActive ? "bg-current opacity-50" : colorClass
                )} />

                <div className="flex flex-col text-left">
                  <span className={cn(
                    "text-xs font-black uppercase tracking-wider",
                    isActive ? textColor : "text-white"
                  )}>
                    {getActionLabel(action, scenario)}
                  </span>
                  <span className={cn(
                    "text-[10px] font-bold",
                    isActive ? textColor : "text-zinc-500"
                  )}>
                    {handCount} mãos ({handPct}%)
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className={cn(
                  "text-xs font-black font-mono",
                  isActive ? textColor : "text-zinc-400"
                )}>
                  {comboPct}%
                </span>
                <p className={cn(
                  "text-[9px] uppercase font-bold tracking-tighter",
                  isActive ? textColor : "text-zinc-600"
                )}>Combos</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Visual combo bar */}
      <div className="space-y-2">
        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-zinc-950 ring-1 ring-white/5">
          {relevantActions.map((action) => (
            <div
              key={action}
              className={cn(getActionColor(action), "transition-all duration-700 ease-out",
                filterAction && filterAction !== action && "opacity-10"
              )}
              style={{ width: `${(comboStats[action] / totalCombos) * 100}%` }}
            />
          ))}
        </div>
      </div>

      {/* Interactive Hint */}
      <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3">
         <p className="text-[9px] text-emerald-500/80 font-bold uppercase tracking-widest leading-relaxed">
          <span className="text-emerald-500">DICA:</span> Clique nas ações acima para filtrar o grid e estudar sub-ranges específicos.
        </p>
      </div>
    </div>
  )
}

