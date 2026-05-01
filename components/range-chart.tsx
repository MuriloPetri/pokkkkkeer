"use client"

import { useRef, useState } from "react"
import {
  RANKS, getHandLabel, getHandType, getActionColor, getActionTextColor,
  getComboCount, getHandTip,
  type Action, type Scenario
} from "@/lib/poker-ranges"
import { cn } from "@/lib/utils"

interface RangeChartProps {
  range: Record<string, Action>
  scenario: Scenario
  filterAction?: Action | null
  highlightHand?: string | null
  onHandClick?: (hand: string) => void
}

interface TooltipData {
  hand: string
  action: Action
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
    const action = range[hand] || 'fold'
    const rect = e.currentTarget.getBoundingClientRect()
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!containerRect) return
    setTooltip({
      hand,
      action,
      type: getHandType(
        RANKS.indexOf(hand[0] as typeof RANKS[number]),
        RANKS.indexOf((hand[1] === hand[0] ? hand[1] : hand.replace('s','').replace('o','')[1]) as typeof RANKS[number])
      ),
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top,
    })
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
            const action = range[hand] || 'fold'
            const handType = getHandType(row, col)
            const isHighlighted = highlightHand === hand
            const isFiltered = filterAction != null && action !== filterAction
            const isSelected = highlightHand === hand

            return (
              <button
                key={hand}
                onClick={() => onHandClick?.(hand)}
                onMouseEnter={(e) => handleMouseEnter(e, hand)}
                onMouseLeave={() => setTooltip(null)}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-[3px] text-[7px] font-mono font-medium transition-all duration-150 sm:text-[9px] md:text-[10px] lg:text-xs",
                  getActionColor(action),
                  getActionTextColor(action),
                  handType === 'pair' && "ring-1 ring-white/10",
                  isSelected && "ring-2 ring-white scale-110 z-10 relative shadow-lg",
                  !isSelected && !isFiltered && "hover:brightness-125 hover:scale-105 hover:z-10 hover:relative",
                  isFiltered && "opacity-10 scale-95",
                )}
                title={`${hand} — ${action}`}
                aria-label={`${hand}: ${action}`}
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
          <div className="rounded-xl border border-zinc-700 bg-zinc-900/95 px-3 py-2.5 shadow-2xl backdrop-blur-md min-w-[160px]">
            {/* Hand name + type */}
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="text-base font-black text-white font-mono">{tooltip.hand}</span>
              <span className="text-[10px] text-zinc-400 font-medium">
                {TYPE_ICONS[tooltip.type]} {TYPE_LABELS[tooltip.type]}
              </span>
            </div>

            {/* Action badge */}
            <div className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-bold mb-2",
              getActionColor(tooltip.action),
              getActionTextColor(tooltip.action)
            )}>
              {tooltip.action === 'raise' && scenario === 'facing3Bet' ? '4-Bet' :
               tooltip.action === 'raise' ? 'Raise' :
               tooltip.action === '3bet' ? '3-Bet' :
               tooltip.action === 'call' ? 'Pagar' : 'Fold'}
            </div>

            {/* Combos */}
            <div className="text-[10px] text-zinc-500 mb-1.5">
              {getComboCount(tooltip.hand)} combos possíveis
            </div>

            {/* Tip */}
            <p className="text-[10px] leading-snug text-zinc-400 border-t border-zinc-800 pt-1.5">
              {getHandTip(tooltip.hand, tooltip.action, scenario)}
            </p>
          </div>

          {/* Arrow */}
          <div className="mx-auto w-2 h-2 bg-zinc-900 rotate-45 border-r border-b border-zinc-700 -mt-1" />
        </div>
      )}
    </div>
  )
}
