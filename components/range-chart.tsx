"use client"

import { useRef, useState } from "react"
import {
  RANKS, getHandLabel, getHandType, getActionColor, getActionTextColor,
  getComboCount, getHandTip, getActionLabel,
  type Action, type Scenario, type MixedAction
} from "@/lib/poker-ranges"
import { cn } from "@/lib/utils"

interface RangeChartProps {
  range: Record<string, MixedAction>
  scenario: Scenario
  filterAction?: Action | null
  highlightHand?: string | null
  onHandClick?: (hand: string) => void
}

interface TooltipData {
  hand: string
  mixedAction: MixedAction
  type: 'pair' | 'suited' | 'offsuit'
  x: number
  y: number
}

const TYPE_LABELS = { pair: 'Par', suited: 'Suited', offsuit: 'Offsuit' }
const TYPE_ICONS  = { pair: '♦', suited: '♠♥', offsuit: '♠♣' }

export function RangeChart({ range, scenario, filterAction, highlightHand, onHandClick }: RangeChartProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, hand: string) => {
    const mixedAction = range[hand] || 'fold'
    const rect = e.currentTarget.getBoundingClientRect()
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!containerRect) return
    setTooltip({
      hand,
      mixedAction,
      type: getHandType(
        RANKS.indexOf(hand[0] as typeof RANKS[number]),
        RANKS.indexOf((hand[1] === hand[0] ? hand[1] : hand.replace('s','').replace('o','')[1]) as typeof RANKS[number])
      ),
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top,
    })
  }

  // Helper to get background style for a cell (handles mixed strategies)
  const getCellBackground = (mixedAction: MixedAction) => {
    if (typeof mixedAction === 'string') {
      return getActionColor(mixedAction)
    }
    
    // Multiple actions - create a linear gradient based on frequencies
    let cumulative = 0
    const stops = mixedAction.map((ma) => {
      const color = getActionColor(ma.action).match(/\[(.*?)\]/)?.[1] || 'gray'
      const start = cumulative * 100
      cumulative += ma.frequency
      const end = cumulative * 100
      return `${color} ${start}%, ${color} ${end}%`
    })
    
    return `linear-gradient(to right, ${stops.join(', ')})`
  }

  return (
    <div ref={containerRef} className="relative w-full select-none">
      {/* Column headers */}
      <div className="grid gap-[2px] mb-[2px]" style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}>
        <div className="aspect-square" />
        {RANKS.map((rank) => (
          <div key={rank} className="aspect-square flex items-center justify-center text-[10px] font-mono text-zinc-500 sm:text-xs">
            {rank}
          </div>
        ))}
      </div>

      {/* Grid */}
      {RANKS.map((rowRank, row) => (
        <div key={rowRank} className="grid gap-[2px] mb-[2px]" style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}>
          {/* Row header */}
          <div className="aspect-square flex items-center justify-center text-[10px] font-mono text-zinc-500 sm:text-xs">
            {rowRank}
          </div>

          {RANKS.map((_, col) => {
            const hand = getHandLabel(row, col)
            const mixedAction = range[hand] || 'fold'
            const handType = getHandType(row, col)
            const isHighlighted = highlightHand === hand
            
            // Check if filtered
            let isFiltered = false
            if (filterAction != null) {
              if (typeof mixedAction === 'string') {
                isFiltered = mixedAction !== filterAction
              } else {
                isFiltered = !mixedAction.some(ma => ma.action === filterAction)
              }
            }

            const isSelected = highlightHand === hand
            const bgStyle = getCellBackground(mixedAction)
            const isMixed = typeof mixedAction !== 'string'
            
            // Text color logic for mixed cells (use the primary action's text color)
            const primaryAction = typeof mixedAction === 'string' 
              ? mixedAction 
              : mixedAction.reduce((prev, curr) => curr.frequency > prev.frequency ? curr : prev).action

            return (
              <button
                key={hand}
                onClick={() => onHandClick?.(hand)}
                onMouseEnter={(e) => handleMouseEnter(e, hand)}
                onMouseLeave={() => setTooltip(null)}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-[3px] text-[7px] font-mono font-medium transition-all duration-150 sm:text-[9px] md:text-[10px] lg:text-xs",
                  !isMixed && bgStyle,
                  getActionTextColor(primaryAction),
                  handType === 'pair' && "ring-1 ring-white/10",
                  isSelected && "ring-2 ring-white scale-110 z-10 relative shadow-lg",
                  !isSelected && !isFiltered && "hover:brightness-125 hover:scale-105 hover:z-10 hover:relative",
                  isFiltered && "opacity-10 scale-95",
                )}
                style={isMixed ? { background: bgStyle } : {}}
                aria-label={`${hand}`}
              >
                {hand}
              </button>
            )
          })}
        </div>
      ))}

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y - 8 }}
        >
          <div className="rounded-xl border border-zinc-700 bg-zinc-900/95 px-3 py-2.5 shadow-2xl backdrop-blur-md min-w-[180px]">
            {/* Hand name + type */}
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-base font-black text-white font-mono">{tooltip.hand}</span>
              <span className="text-[10px] text-zinc-400 font-medium">
                {TYPE_ICONS[tooltip.type]} {TYPE_LABELS[tooltip.type]}
              </span>
            </div>

            {/* Mixed Action Display */}
            <div className="flex flex-col gap-1.5 mb-2.5">
              {typeof tooltip.mixedAction === 'string' ? (
                <div className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-bold w-fit",
                  getActionColor(tooltip.mixedAction),
                  getActionTextColor(tooltip.mixedAction)
                )}>
                  {getActionLabel(tooltip.mixedAction, scenario)}
                </div>
              ) : (
                tooltip.mixedAction.map((ma, i) => (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-bold",
                      getActionColor(ma.action),
                      getActionTextColor(ma.action)
                    )}>
                      {getActionLabel(ma.action, scenario)}
                    </div>
                    <span className="text-[10px] text-zinc-300 font-mono">
                      {Math.round(ma.frequency * 100)}%
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Combos */}
            <div className="text-[10px] text-zinc-500 mb-2 border-t border-zinc-800 pt-2">
              {getComboCount(tooltip.hand)} combos possíveis
            </div>

            {/* Tip (using primary action for the tip) */}
            <p className="text-[10px] leading-snug text-zinc-400 italic">
              {getHandTip(
                tooltip.hand, 
                typeof tooltip.mixedAction === 'string' 
                  ? tooltip.mixedAction 
                  : tooltip.mixedAction[0].action, 
                scenario
              )}
            </p>
          </div>

          {/* Arrow */}
          <div className="mx-auto w-2 h-2 bg-zinc-900 rotate-45 border-r border-b border-zinc-700 -mt-1" />
        </div>
      )}
    </div>
  )
}

