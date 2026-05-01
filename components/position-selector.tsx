"use client"

import { POSITIONS_BY_TABLE, POSITION_LABELS, type Position, type TableSize } from "@/lib/poker-ranges"
import { cn } from "@/lib/utils"

interface PositionSelectorProps {
  selected: Position
  onSelect: (pos: Position) => void
  tableSize: TableSize
}

// Approximate table layout coordinates (percentage-based) for each table size
const TABLE_POSITIONS: Record<TableSize, Record<string, { top: string; left: string }>> = {
  '6max': {
    UTG: { top: '5%', left: '15%' },
    MP: { top: '5%', left: '50%' },
    CO: { top: '5%', left: '85%' },
    BTN: { top: '85%', left: '75%' },
    SB: { top: '85%', left: '25%' },
    BB: { top: '45%', left: '2%' },
  },
  '9max': {
    UTG: { top: '5%', left: '10%' },
    UTG1: { top: '5%', left: '33%' },
    UTG2: { top: '5%', left: '56%' },
    LJ: { top: '5%', left: '80%' },
    HJ: { top: '35%', left: '92%' },
    CO: { top: '75%', left: '90%' },
    BTN: { top: '90%', left: '60%' },
    SB: { top: '90%', left: '30%' },
    BB: { top: '65%', left: '5%' },
  },
  'headsup': {
    BTN: { top: '85%', left: '50%' },
    BB: { top: '5%', left: '50%' },
  },
}

export function PositionSelector({ selected, onSelect, tableSize }: PositionSelectorProps) {
  const positions = POSITIONS_BY_TABLE[tableSize]
  const layout = TABLE_POSITIONS[tableSize]

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-sm font-semibold text-zinc-400">Selecione sua Posição</h3>

      {/* Poker Table Visualization */}
      <div className="relative mx-auto w-full max-w-[320px] px-4">
        {/* Table Felt */}
        <div className="relative aspect-[1.8/1] w-full rounded-full border-[6px] border-zinc-800 bg-[#1a4a2e] shadow-[inset_0_10px_40px_rgba(0,0,0,0.6),0_10px_30px_rgba(0,0,0,0.4)]">
           {/* Inner felt pattern/border */}
           <div className="absolute inset-4 rounded-full border border-white/5 opacity-40" />
           
           {/* Table Logo/Center text */}
           <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-[10px] font-black tracking-[0.2em] text-white/5 uppercase select-none">
               Pokerzin GTO
             </span>
           </div>
        </div>

        {/* Position buttons around the table */}
        <div className="absolute inset-0">
          {positions.map((pos) => {
            const coords = layout[pos]
            if (!coords) return null
            return (
              <PositionButton
                key={pos}
                position={pos}
                selected={selected}
                onSelect={onSelect}
                style={{ 
                  top: coords.top, 
                  left: coords.left,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            )
          })}
          
          {/* Dealer Button Indicator (Moves to BTN position) */}
          {layout['BTN'] && (
             <div 
               className="absolute z-20 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 bg-white text-[10px] font-black text-black shadow-md transition-all duration-500 ease-in-out sm:h-7 sm:w-7"
               style={{ 
                 top: `calc(${layout['BTN'].top} - 28px)`, 
                 left: `calc(${layout['BTN'].left} + 22px)`,
                 transform: 'translate(-50%, -50%)'
               }}
             >
               D
             </div>
          )}
        </div>
      </div>

      {/* Current position info card */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-center backdrop-blur-sm">
        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Posição Ativa</p>
        <p className="text-sm font-bold text-white">{POSITION_LABELS[selected]}</p>
      </div>
    </div>
  )
}

function PositionButton({
  position,
  selected,
  onSelect,
  style,
}: {
  position: Position
  selected: Position
  onSelect: (pos: Position) => void
  style: React.CSSProperties
}) {
  const isSelected = selected === position
  
  return (
    <button
      onClick={() => onSelect(position)}
      style={style}
      className={cn(
        "absolute z-10 flex h-10 w-10 flex-col items-center justify-center rounded-xl transition-all duration-200 sm:h-12 sm:w-12",
        "group active:scale-90",
        isSelected
          ? "bg-zinc-100 text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] ring-2 ring-white"
          : "bg-zinc-900/80 text-zinc-400 border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800"
      )}
      aria-label={`${POSITION_LABELS[position]}`}
    >
      <span className="text-[10px] font-black font-mono leading-none sm:text-[11px]">
        {position}
      </span>
      {isSelected && (
        <span className="absolute -bottom-1 h-1 w-4 rounded-full bg-black/20" />
      )}
      
      {/* Tooltip hint on hover (simplified) */}
      <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap rounded bg-black px-1.5 py-0.5 text-[8px] text-white">
        {POSITION_LABELS[position]}
      </div>
    </button>
  )
}

