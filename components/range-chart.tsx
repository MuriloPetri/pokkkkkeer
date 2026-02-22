"use client"

import { RANKS, getHandLabel, getHandType, getActionColor, getActionTextColor, type Action } from "@/lib/poker-ranges"
import { cn } from "@/lib/utils"

interface RangeChartProps {
  range: Record<string, Action>
  highlightHand?: string | null
  onHandClick?: (hand: string) => void
}

export function RangeChart({ range, highlightHand, onHandClick }: RangeChartProps) {
  return (
    <div className="w-full">
      {/* Column headers */}
      <div className="grid gap-[2px] mb-[2px]" style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}>
        <div className="aspect-square" />
        {RANKS.map((rank) => (
          <div
            key={rank}
            className="aspect-square flex items-center justify-center text-[10px] font-mono text-muted-foreground sm:text-xs"
          >
            {rank}
          </div>
        ))}
      </div>

      {/* Grid */}
      {RANKS.map((rowRank, row) => (
        <div key={rowRank} className="grid gap-[2px] mb-[2px]" style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}>
          {/* Row header */}
          <div className="aspect-square flex items-center justify-center text-[10px] font-mono text-muted-foreground sm:text-xs">
            {rowRank}
          </div>

          {RANKS.map((_, col) => {
            const hand = getHandLabel(row, col)
            const action = range[hand] || 'fold'
            const handType = getHandType(row, col)
            const isHighlighted = highlightHand === hand

            return (
              <button
                key={hand}
                onClick={() => onHandClick?.(hand)}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-[3px] text-[7px] font-mono font-medium transition-all sm:text-[9px] md:text-[10px] lg:text-xs",
                  getActionColor(action),
                  getActionTextColor(action),
                  handType === 'pair' && "ring-1 ring-foreground/10",
                  isHighlighted && "ring-2 ring-foreground scale-110 z-10 relative shadow-lg",
                  !isHighlighted && "hover:brightness-110 hover:scale-105"
                )}
                title={`${hand} - ${action}`}
                aria-label={`${hand}: ${action}`}
              >
                {hand}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
