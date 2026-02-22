"use client"

import { type Action, type Scenario, getActionLabel, getRangeStats } from "@/lib/poker-ranges"

interface RangeLegendProps {
  range: Record<string, Action>
  scenario: Scenario
}

const LEGEND_ITEMS: { action: Action; bgClass: string; textClass: string }[] = [
  { action: 'raise', bgClass: 'bg-[oklch(0.72_0.19_160)]', textClass: 'text-[oklch(0.13_0.005_260)]' },
  { action: '3bet', bgClass: 'bg-[oklch(0.75_0.15_55)]', textClass: 'text-[oklch(0.13_0.005_260)]' },
  { action: 'call', bgClass: 'bg-[oklch(0.6_0.15_250)]', textClass: 'text-[oklch(0.95_0_0)]' },
  { action: 'fold', bgClass: 'bg-[oklch(0.25_0.01_260)]', textClass: 'text-[oklch(0.5_0_0)]' },
]

export function RangeLegend({ range, scenario }: RangeLegendProps) {
  const stats = getRangeStats(range)
  const total = 169

  // Filter relevant actions for this scenario
  const relevantItems = LEGEND_ITEMS.filter((item) => {
    if (scenario === 'RFI') return item.action === 'raise' || item.action === 'fold'
    return item.action === '3bet' || item.action === 'call' || item.action === 'fold' || item.action === 'raise'
  }).filter((item) => stats[item.action] > 0)

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-muted-foreground">Legenda das Acoes</h3>
      <div className="flex flex-wrap gap-2">
        {relevantItems.map(({ action, bgClass, textClass }) => (
          <div
            key={action}
            className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 px-2.5 py-1.5"
          >
            <div className={`h-3 w-3 rounded-sm ${bgClass}`} />
            <span className="text-xs font-medium text-foreground">
              {getActionLabel(action, scenario)}
            </span>
            <span className="text-xs text-muted-foreground">
              {stats[action]} ({Math.round((stats[action] / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>

      {/* Visual bar */}
      <div className="flex h-2 w-full overflow-hidden rounded-full">
        {relevantItems.map(({ action, bgClass }) => (
          <div
            key={action}
            className={`${bgClass} transition-all duration-300`}
            style={{ width: `${(stats[action] / total) * 100}%` }}
          />
        ))}
      </div>
    </div>
  )
}
