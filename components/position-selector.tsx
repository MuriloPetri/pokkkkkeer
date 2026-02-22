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
    UTG: { top: '-4%', left: '18%' },
    MP: { top: '-4%', left: '46%' },
    CO: { top: '-4%', left: '74%' },
    BTN: { top: '80%', left: '78%' },
    SB: { top: '80%', left: '36%' },
    BB: { top: '40%', left: '-2%' },
  },
  '9max': {
    UTG: { top: '-4%', left: '10%' },
    UTG1: { top: '-4%', left: '30%' },
    UTG2: { top: '-4%', left: '50%' },
    LJ: { top: '-4%', left: '70%' },
    HJ: { top: '25%', left: '92%' },
    CO: { top: '60%', left: '88%' },
    BTN: { top: '85%', left: '68%' },
    SB: { top: '85%', left: '32%' },
    BB: { top: '60%', left: '-4%' },
  },
  'headsup': {
    BTN: { top: '80%', left: '60%' },
    BB: { top: '-4%', left: '36%' },
  },
}

export function PositionSelector({ selected, onSelect, tableSize }: PositionSelectorProps) {
  const positions = POSITIONS_BY_TABLE[tableSize]
  const layout = TABLE_POSITIONS[tableSize]

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-muted-foreground">Posicao na Mesa</h3>

      {/* Poker Table Visualization */}
      <div className="relative mx-auto w-full max-w-[280px]">
        <div className="mx-auto aspect-[1.6/1] w-full rounded-full border-2 border-border bg-secondary/50" />

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
                style={{ top: coords.top, left: coords.left }}
              />
            )
          })}
        </div>
      </div>

      {/* Current position info */}
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">{POSITION_LABELS[selected]}</p>
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
        "absolute flex h-9 w-9 items-center justify-center rounded-full text-[9px] font-mono font-bold transition-all sm:h-10 sm:w-10 sm:text-[10px]",
        isSelected
          ? "bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/50"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      )}
      aria-label={`${POSITION_LABELS[position]}${isSelected ? ' - selecionado' : ''}`}
    >
      {position}
    </button>
  )
}
