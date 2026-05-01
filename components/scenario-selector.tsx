"use client"

import { SCENARIO_LABELS, SCENARIO_DESCRIPTIONS, type Scenario, type Position } from "@/lib/poker-ranges"
import { cn } from "@/lib/utils"

interface ScenarioSelectorProps {
  selected: Scenario
  onSelect: (scenario: Scenario) => void
  position: Position
}

const SCENARIOS: Scenario[] = ['RFI', 'vs3Bet', 'facing3Bet']

// Positions that act first preflop and therefore can't "face a raise" from someone else.
// They CAN face a 3-bet after their own open.
const FIRST_TO_ACT: Position[] = ['UTG', 'UTG1', 'UTG2']

export function ScenarioSelector({ selected, onSelect, position }: ScenarioSelectorProps) {
  const isUTG = FIRST_TO_ACT.includes(position)

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-muted-foreground">Situação</h3>
      <div className="flex flex-col gap-2">
        {SCENARIOS.map((scenario) => {
          // "vs3Bet" = facing an open raise from someone else.
          // UTG acts first, so this scenario doesn't apply.
          const isDisabled = scenario === 'vs3Bet' && isUTG

          return (
            <button
              key={scenario}
              onClick={() => !isDisabled && onSelect(scenario)}
              disabled={isDisabled}
              title={isDisabled ? `${position} age primeiro — não enfrenta abertura de outros jogadores` : undefined}
              className={cn(
                "flex flex-col items-start gap-1 rounded-lg border px-3 py-2.5 text-left transition-all",
                isDisabled
                  ? "border-zinc-800 bg-zinc-900/30 opacity-40 cursor-not-allowed"
                  : selected === scenario
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/50 hover:bg-secondary/50"
              )}
            >
              <span className="text-sm font-medium">{SCENARIO_LABELS[scenario]}</span>
              <span className="text-xs text-muted-foreground">
                {isDisabled
                  ? `${position} é o primeiro a agir — esse cenário não se aplica`
                  : SCENARIO_DESCRIPTIONS[scenario]}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
