"use client"

import { SCENARIO_LABELS, SCENARIO_DESCRIPTIONS, isScenarioApplicable, type Scenario, type Position, type TableSize } from "@/lib/poker-ranges"
import { cn } from "@/lib/utils"

interface ScenarioSelectorProps {
  selected: Scenario
  onSelect: (scenario: Scenario) => void
  position: Position
  tableSize: TableSize
}

const SCENARIOS: Scenario[] = ['RFI', 'vs3Bet', 'facing3Bet']

const NOT_APPLICABLE_REASONS: Partial<Record<string, string>> = {
  // BB + RFI
  'BB_RFI': 'BB está no fim da ação — não tem range de abertura tradicional',
  // UTG + vs3Bet
  'UTG_vs3Bet': 'UTG age primeiro — ninguém abriu antes dele',
  // HU BTN + vs3Bet
  'BTN_vs3Bet_headsup': 'No Heads-Up, BTN é quem abre — não enfrenta raise',
}

function getNotApplicableReason(position: Position, scenario: Scenario, tableSize: TableSize): string | null {
  if (position === 'BB' && scenario === 'RFI') return NOT_APPLICABLE_REASONS['BB_RFI'] ?? null
  if (position === 'UTG' && scenario === 'vs3Bet') return NOT_APPLICABLE_REASONS['UTG_vs3Bet'] ?? null
  if (tableSize === 'headsup' && position === 'BTN' && scenario === 'vs3Bet') return NOT_APPLICABLE_REASONS['BTN_vs3Bet_headsup'] ?? null
  return null
}

export function ScenarioSelector({ selected, onSelect, position, tableSize }: ScenarioSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-muted-foreground">Situação</h3>
      <div className="flex flex-col gap-2">
        {SCENARIOS.map((scenario) => {
          const applicable = isScenarioApplicable(position, scenario, tableSize)
          const reason = getNotApplicableReason(position, scenario, tableSize)

          return (
            <button
              key={scenario}
              onClick={() => applicable && onSelect(scenario)}
              disabled={!applicable}
              title={reason ?? undefined}
              className={cn(
                "flex flex-col items-start gap-1 rounded-lg border px-3 py-2.5 text-left transition-all",
                !applicable
                  ? "border-zinc-800/50 bg-zinc-900/20 opacity-40 cursor-not-allowed"
                  : selected === scenario
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/50 hover:bg-secondary/50"
              )}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-sm font-medium">{SCENARIO_LABELS[scenario]}</span>
                {!applicable && (
                  <span className="shrink-0 rounded-full bg-zinc-800 px-1.5 py-0.5 text-[9px] font-medium text-zinc-500 uppercase tracking-wider">
                    N/A
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {!applicable && reason ? reason : SCENARIO_DESCRIPTIONS[scenario]}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
