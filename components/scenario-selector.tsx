"use client"

import { SCENARIO_LABELS, SCENARIO_DESCRIPTIONS, type Scenario } from "@/lib/poker-ranges"
import { cn } from "@/lib/utils"

interface ScenarioSelectorProps {
  selected: Scenario
  onSelect: (scenario: Scenario) => void
}

const SCENARIOS: Scenario[] = ['RFI', 'vs3Bet', 'facing3Bet']

export function ScenarioSelector({ selected, onSelect }: ScenarioSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-muted-foreground">Situacao</h3>
      <div className="flex flex-col gap-2">
        {SCENARIOS.map((scenario) => (
          <button
            key={scenario}
            onClick={() => onSelect(scenario)}
            className={cn(
              "flex flex-col items-start gap-1 rounded-lg border px-3 py-2.5 text-left transition-all",
              selected === scenario
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/50 hover:bg-secondary/50"
            )}
          >
            <span className="text-sm font-medium">{SCENARIO_LABELS[scenario]}</span>
            <span className="text-xs text-muted-foreground">{SCENARIO_DESCRIPTIONS[scenario]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
