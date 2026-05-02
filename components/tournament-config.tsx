"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Trophy, Users, Clock, Coins, TrendingUp, RotateCcw,
  ChevronDown, ChevronUp, Zap, Target, BarChart2, AlertTriangle,
  Timer, DollarSign, Layers, Shield
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ────────────────────────────────────────────────────────────────────

export interface TournamentConfig {
  // Mesa
  tableSize: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  position: number // 1 = SB, 2 = BB, etc.

  // Stack & Blinds
  myStack: number       // em fichas
  bigBlind: number      // valor atual do BB
  smallBlind: number    // valor atual do SB
  ante: number          // ante (0 = sem ante)
  bbAnte: boolean       // true = BB paga o ante por todos

  // Nível de blinds
  currentLevel: number
  levelDurationMinutes: number
  timeRemainingSeconds: number

  // Torneio
  totalPlayers: number
  remainingPlayers: number
  buyIn: number
  prizePool: number
  myPrizeSoFar: number  // fichas ganhas já convertidas

  // ICM / Pressão
  payingPositions: number  // quantos pagam (top X%)
  myPosition: number       // posição atual no ranking

  // Estratégia
  rebuyAllowed: boolean
  isOnTheBubble: boolean
}

const DEFAULT_CONFIG: TournamentConfig = {
  tableSize: 6,
  position: 1,
  myStack: 20000,
  bigBlind: 400,
  smallBlind: 200,
  ante: 0,
  bbAnte: false,
  currentLevel: 8,
  levelDurationMinutes: 15,
  timeRemainingSeconds: 540,
  totalPlayers: 100,
  remainingPlayers: 32,
  buyIn: 50,
  prizePool: 5000,
  myPrizeSoFar: 0,
  payingPositions: 15,
  myPosition: 14,
  rebuyAllowed: false,
  isOnTheBubble: false,
}

const STORAGE_KEY = "pokerzin_tournament_config"

// ── Helpers ──────────────────────────────────────────────────────────────────

function calcM(stack: number, bb: number, sb: number, ante: number, players: number, bbAnte: boolean): number {
  const potPerOrbit = bb + sb + (bbAnte ? ante : ante * players)
  if (potPerOrbit <= 0) return 0
  return stack / potPerOrbit
}

function calcBBs(stack: number, bb: number): number {
  if (bb <= 0) return 0
  return stack / bb
}

function getMZone(m: number): { label: string; color: string; desc: string } {
  if (m >= 20) return { label: "Zona Verde", color: "text-emerald-400", desc: "Stack confortável — jogo completo disponível" }
  if (m >= 10) return { label: "Zona Amarela", color: "text-yellow-400", desc: "Atenção — começa a sentir pressão dos blinds" }
  if (m >= 6)  return { label: "Zona Laranja", color: "text-orange-400", desc: "Perigo — jogo de push/fold se aproxima" }
  if (m >= 1)  return { label: "Zona Vermelha", color: "text-red-400", desc: "Crítico — push/fold obrigatório" }
  return        { label: "Zona Preta", color: "text-zinc-400", desc: "Eliminação iminente — all-in ou fold" }
}

function getBBZone(bbs: number): { label: string; color: string } {
  if (bbs >= 50) return { label: "Deep Stack", color: "text-emerald-400" }
  if (bbs >= 25) return { label: "Médio", color: "text-blue-400" }
  if (bbs >= 15) return { label: "Short", color: "text-yellow-400" }
  if (bbs >= 10) return { label: "Micro Short", color: "text-orange-400" }
  return          { label: "Push/Fold", color: "text-red-400" }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

// ── Number Input Component ────────────────────────────────────────────────────

function NumberInput({
  label, value, onChange, min = 0, max, step = 1, prefix, suffix, hint
}: {
  label: string; value: number; onChange: (v: number) => void
  min?: number; max?: number; step?: number
  prefix?: string; suffix?: string; hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</label>
      <div className="flex items-center gap-0 rounded-xl border border-white/8 bg-zinc-950 overflow-hidden focus-within:border-emerald-500/50 transition-colors">
        {prefix && <span className="px-3 text-xs text-zinc-500 font-mono bg-zinc-900 border-r border-white/5 py-2.5">{prefix}</span>}
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white font-mono outline-none min-w-0"
        />
        {suffix && <span className="px-3 text-xs text-zinc-500 font-mono bg-zinc-900 border-l border-white/5 py-2.5">{suffix}</span>}
        <div className="flex flex-col border-l border-white/5">
          <button
            type="button"
            onClick={() => onChange(Math.min(max ?? Infinity, value + step))}
            className="px-2 py-1 text-zinc-500 hover:text-emerald-400 hover:bg-white/5 transition-colors"
          >
            <ChevronUp className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => onChange(Math.max(min, value - step))}
            className="px-2 py-1 text-zinc-500 hover:text-emerald-400 hover:bg-white/5 transition-colors border-t border-white/5"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>
      {hint && <p className="text-[10px] text-zinc-600">{hint}</p>}
    </div>
  )
}

function ToggleInput({ label, value, onChange, hint }: { label: string; value: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-bold text-zinc-300">{label}</p>
        {hint && <p className="text-[10px] text-zinc-600">{hint}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={cn(
          "relative h-6 w-11 rounded-full border transition-all duration-200 shrink-0",
          value ? "bg-emerald-500 border-emerald-500" : "bg-zinc-800 border-white/10"
        )}
      >
        <span className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
          value ? "translate-x-5" : "translate-x-0.5"
        )} />
      </button>
    </div>
  )
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="rounded-2xl border border-white/5 bg-zinc-900/40 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 hover:bg-white/2 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-emerald-500">{icon}</span>
          <span className="text-sm font-black text-white uppercase tracking-wider">{title}</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
      </button>
      {open && <div className="px-5 pb-5 space-y-4">{children}</div>}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export function TournamentConfig() {
  const [config, setConfig] = useState<TournamentConfig>(DEFAULT_CONFIG)
  const [timerActive, setTimerActive] = useState(false)

  // Persist to localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try { setConfig(JSON.parse(saved)) } catch {}
    }
  }, [])

  const update = useCallback((partial: Partial<TournamentConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...partial }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  // Timer countdown
  useEffect(() => {
    if (!timerActive) return
    const interval = setInterval(() => {
      setConfig((prev) => {
        const next = { ...prev, timeRemainingSeconds: Math.max(0, prev.timeRemainingSeconds - 1) }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        return next
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timerActive])

  // Derived values
  const bbs = calcBBs(config.myStack, config.bigBlind)
  const mValue = calcM(config.myStack, config.bigBlind, config.smallBlind, config.ante, config.tableSize, config.bbAnte)
  const mZone = getMZone(mValue)
  const bbZone = getBBZone(bbs)
  const bubbleDistance = config.remainingPlayers - config.payingPositions
  const itm = config.remainingPlayers <= config.payingPositions
  const timerPct = config.levelDurationMinutes > 0
    ? (config.timeRemainingSeconds / (config.levelDurationMinutes * 60)) * 100
    : 0

  const resetTimer = () => {
    update({ timeRemainingSeconds: config.levelDurationMinutes * 60 })
    setTimerActive(false)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ── Status Dashboard ───────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* BBs */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-4 space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Meu Stack</p>
          <p className={cn("text-2xl font-black font-mono", bbZone.color)}>{bbs.toFixed(1)}</p>
          <p className="text-[10px] text-zinc-500">BB · <span className={bbZone.color}>{bbZone.label}</span></p>
        </div>

        {/* M Factor */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-4 space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Fator M</p>
          <p className={cn("text-2xl font-black font-mono", mZone.color)}>{mValue.toFixed(1)}</p>
          <p className={cn("text-[10px]", mZone.color)}>{mZone.label}</p>
        </div>

        {/* Players Remaining */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-4 space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Jogadores</p>
          <p className="text-2xl font-black font-mono text-white">{config.remainingPlayers}</p>
          <p className="text-[10px] text-zinc-500">
            {itm
              ? <span className="text-emerald-400">✓ No Dinheiro</span>
              : bubbleDistance <= 5
                ? <span className="text-orange-400">⚠ {bubbleDistance} da bolha</span>
                : <span>de {config.totalPlayers}</span>
            }
          </p>
        </div>

        {/* Timer */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-4 space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Nível {config.currentLevel}</p>
          <p className={cn(
            "text-2xl font-black font-mono",
            config.timeRemainingSeconds < 60 ? "text-red-400 animate-pulse" : "text-white"
          )}>
            {formatTime(config.timeRemainingSeconds)}
          </p>
          <div className="flex gap-1 mt-1">
            <button
              onClick={() => setTimerActive((v) => !v)}
              className={cn(
                "text-[9px] font-bold px-2 py-0.5 rounded-md transition-colors",
                timerActive ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
              )}
            >
              {timerActive ? "⏸ Pausar" : "▶ Iniciar"}
            </button>
            <button
              onClick={resetTimer}
              className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              ↺
            </button>
          </div>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden -mt-3">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000",
            timerPct > 50 ? "bg-emerald-500" : timerPct > 25 ? "bg-yellow-500" : "bg-red-500"
          )}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      {/* M Zone tip */}
      <div className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3",
        mZone.color === "text-red-400" || mZone.color === "text-zinc-400"
          ? "border-red-500/20 bg-red-950/20"
          : mZone.color === "text-orange-400"
            ? "border-orange-500/20 bg-orange-950/20"
            : "border-white/5 bg-zinc-900/30"
      )}>
        <AlertTriangle className={cn("h-4 w-4 mt-0.5 shrink-0", mZone.color)} />
        <div>
          <p className={cn("text-xs font-bold", mZone.color)}>{mZone.label} — {mValue.toFixed(1)}x</p>
          <p className="text-xs text-zinc-400 mt-0.5">{mZone.desc}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-4">

          {/* Stack & Blinds */}
          <Section title="Stack & Blinds" icon={<Coins className="h-4 w-4" />}>
            <NumberInput label="Meu Stack (fichas)" value={config.myStack} onChange={(v) => update({ myStack: v })} step={100} min={0} />
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="Big Blind" value={config.bigBlind} onChange={(v) => update({ bigBlind: v, smallBlind: Math.round(v / 2) })} step={50} min={1} />
              <NumberInput label="Small Blind" value={config.smallBlind} onChange={(v) => update({ smallBlind: v })} step={25} min={1} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="Ante" value={config.ante} onChange={(v) => update({ ante: v })} step={25} min={0} />
              <div className="pt-5">
                <ToggleInput label="BB Ante" value={config.bbAnte} onChange={(v) => update({ bbAnte: v })} hint="BB paga o ante por todos" />
              </div>
            </div>
          </Section>

          {/* Mesa */}
          <Section title="Mesa" icon={<Users className="h-4 w-4" />}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Jogadores na Mesa</label>
              <div className="grid grid-cols-8 gap-1">
                {([2,3,4,5,6,7,8,9] as const).map((n) => (
                  <button
                    key={n}
                    onClick={() => update({ tableSize: n })}
                    className={cn(
                      "rounded-lg py-2 text-xs font-black transition-all",
                      config.tableSize === n
                        ? "bg-emerald-500 text-zinc-950"
                        : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Minha Posição</label>
              <div className="grid grid-cols-9 gap-1">
                {Array.from({ length: config.tableSize }, (_, i) => i + 1).map((pos) => {
                  const labels = ["SB","BB","UTG","UTG+1","MP","MP+1","CO","BTN"]
                  const label = pos <= 2 ? (pos === 1 ? "SB" : "BB") : labels[pos - 1] || `P${pos}`
                  return (
                    <button
                      key={pos}
                      onClick={() => update({ position: pos })}
                      className={cn(
                        "rounded-lg py-1.5 text-[10px] font-black transition-all",
                        config.position === pos
                          ? "bg-emerald-500 text-zinc-950"
                          : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
                      )}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
          </Section>

          {/* Nível de Blinds */}
          <Section title="Nível de Blinds" icon={<Timer className="h-4 w-4" />}>
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="Nível Atual" value={config.currentLevel} onChange={(v) => update({ currentLevel: v })} min={1} />
              <NumberInput label="Duração (min)" value={config.levelDurationMinutes} onChange={(v) => {
                update({ levelDurationMinutes: v, timeRemainingSeconds: v * 60 })
              }} min={1} max={120} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tempo Restante</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={config.levelDurationMinutes * 60}
                  value={config.timeRemainingSeconds}
                  onChange={(e) => update({ timeRemainingSeconds: Number(e.target.value) })}
                  className="flex-1 accent-emerald-500"
                />
                <span className="text-sm font-mono font-bold text-white w-14 text-right">
                  {formatTime(config.timeRemainingSeconds)}
                </span>
              </div>
            </div>
          </Section>
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Torneio */}
          <Section title="Torneio" icon={<Trophy className="h-4 w-4" />}>
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="Total de Jogadores" value={config.totalPlayers} onChange={(v) => update({ totalPlayers: v })} min={2} step={10} />
              <NumberInput label="Restantes" value={config.remainingPlayers} onChange={(v) => update({ remainingPlayers: v })} min={1} max={config.totalPlayers} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="Buy-in" value={config.buyIn} onChange={(v) => update({ buyIn: v })} min={0} prefix="R$" step={10} />
              <NumberInput label="Prize Pool Total" value={config.prizePool} onChange={(v) => update({ prizePool: v })} min={0} prefix="R$" step={100} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="Pagando (Top)" value={config.payingPositions} onChange={(v) => update({ payingPositions: v })} min={1} max={config.totalPlayers} suffix="lugares" />
              <NumberInput label="Minha Posição Atual" value={config.myPosition} onChange={(v) => update({ myPosition: v })} min={1} max={config.remainingPlayers} />
            </div>
            <NumberInput
              label="Premio Já Garantido"
              value={config.myPrizeSoFar}
              onChange={(v) => update({ myPrizeSoFar: v })}
              min={0}
              prefix="R$"
              step={100}
              hint="0 se ainda não entrou no dinheiro"
            />
          </Section>

          {/* Extras */}
          <Section title="Regras & Estrutura" icon={<Shield className="h-4 w-4" />}>
            <ToggleInput
              label="Rebuy Permitido"
              value={config.rebuyAllowed}
              onChange={(v) => update({ rebuyAllowed: v })}
              hint="O torneio permite recompra de fichas"
            />
            <ToggleInput
              label="Estamos na Bolha"
              value={config.isOnTheBubble}
              onChange={(v) => update({ isOnTheBubble: v })}
              hint="Ativa alertas ICM de pressão de bolha"
            />
          </Section>

          {/* ICM Info */}
          <Section title="Análise ICM" icon={<BarChart2 className="h-4 w-4" />}>
            <div className="space-y-3 text-xs">
              {/* Stacks em BB */}
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-zinc-400">Stack em BBs</span>
                <span className={cn("font-black font-mono text-base", bbZone.color)}>{bbs.toFixed(1)} BB</span>
              </div>
              {/* Fator M */}
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-zinc-400">Fator M (Harrington)</span>
                <span className={cn("font-black font-mono text-base", mZone.color)}>{mValue.toFixed(2)}</span>
              </div>
              {/* Distância da bolha */}
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-zinc-400">Distância da bolha</span>
                <span className={cn(
                  "font-black font-mono",
                  itm ? "text-emerald-400" : bubbleDistance <= 3 ? "text-red-400" : bubbleDistance <= 8 ? "text-orange-400" : "text-zinc-300"
                )}>
                  {itm ? "ITM ✓" : `${bubbleDistance} jogadores`}
                </span>
              </div>
              {/* % no dinheiro */}
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-zinc-400">% no dinheiro</span>
                <span className="font-black font-mono text-zinc-300">
                  {((config.payingPositions / config.totalPlayers) * 100).toFixed(1)}%
                </span>
              </div>
              {/* Avg stack */}
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-zinc-400">Stack médio do torneio</span>
                <span className="font-black font-mono text-zinc-300">
                  — fichas
                </span>
              </div>
              {/* Custo por órbita */}
              <div className="flex justify-between items-center py-2">
                <span className="text-zinc-400">Custo por órbita</span>
                <span className="font-black font-mono text-zinc-300">
                  {(config.bigBlind + config.smallBlind + (config.bbAnte ? config.ante : config.ante * config.tableSize)).toLocaleString()} fichas
                </span>
              </div>
            </div>

            {/* ICM pressure alert */}
            {config.isOnTheBubble && (
              <div className="flex items-start gap-2 rounded-lg border border-orange-500/30 bg-orange-950/30 p-3 mt-2">
                <Zap className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-orange-400">Pressão de Bolha Ativa</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Stacks médios e grandes devem aumentar a pressão sobre stacks curtos. Evite confrontos com grandes stacks sem mãos premium.
                  </p>
                </div>
              </div>
            )}
          </Section>
        </div>
      </div>

      {/* GTO Analysis */}
      <GTOAnalysis bbs={bbs} mValue={mValue} position={config.position} tableSize={config.tableSize} isOnTheBubble={config.isOnTheBubble} itm={itm} bubbleDistance={bubbleDistance} />

      {/* Reset */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            setConfig(DEFAULT_CONFIG)
            localStorage.removeItem(STORAGE_KEY)
          }}
          className="flex items-center gap-2 rounded-xl border border-white/5 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Resetar Configurações
        </button>
      </div>
    </div>
  )
}

// ── GTO Analysis Component ────────────────────────────────────────────────────

interface GTOProps {
  bbs: number
  mValue: number
  position: number
  tableSize: number
  isOnTheBubble: boolean
  itm: boolean
  bubbleDistance: number
}

interface ActionRec {
  action: string
  color: string
  bg: string
  border: string
  hands: string
  reasoning: string
  priority: "primary" | "secondary" | "avoid"
}

function getPositionLabel(pos: number, size: number): string {
  if (pos === 1) return "SB"
  if (pos === 2) return "BB"
  if (pos === size) return "BTN"
  if (pos === size - 1) return "CO"
  if (pos === 3) return "UTG"
  return `MP`
}

function isLatePosition(pos: number, size: number): boolean {
  return pos >= size - 1 // CO ou BTN
}

function isBlinds(pos: number): boolean {
  return pos <= 2
}

function analyzeGTO(props: GTOProps): {
  style: string
  styleColor: string
  actions: ActionRec[]
  keyTips: string[]
  pushRange: string | null
} {
  const { bbs, mValue, position, tableSize, isOnTheBubble, itm, bubbleDistance } = props
  const posLabel = getPositionLabel(position, tableSize)
  const isLP = isLatePosition(position, tableSize)
  const isBB_SB = isBlinds(position)
  const onBubble = isOnTheBubble || (!itm && bubbleDistance <= 3)

  // ── PUSH/FOLD: < 13 BB ──────────────────────────────────────────────
  if (bbs < 13) {
    const pushRanges: Record<string, string> = {
      "BTN": bbs < 10 ? "Qualquer A, K9s+, KTo+, Q9s+, QJo, JTs, 22+" : "A2+, K2s+, K9o+, Q6s+, QTo+, J8s+, JTo, T8s+, 98s, 22+",
      "CO":  bbs < 10 ? "A2+, KTs+, KQo, Q9s+, JTs, 77+" : "A2+, K9s+, KQo, Q9s+, QJo, JTs, 88+",
      "MP":  bbs < 10 ? "A7o+, A2s+, KTs+, KQo, QJs, 77+" : "A9o+, A4s+, KJs+, KQo, 99+",
      "UTG": bbs < 10 ? "A9o+, A2s+, KQs, QQ+" : "AJo+, ATs+, KQs, JJ+",
      "SB":  bbs < 10 ? "Qualquer A, K2+, Q4s+, Q8o+, J7s+, JTo, T8s+, 22+" : "A2+, K2s+, K7o+, Q5s+, Q9o+, J8s+, JTo, 22+",
      "BB":  "Defender vs push: A2+, K5o+, K2s+, Q8o+, Q4s+, JTo, J8s+, T9s, 55+",
    }
    const range = pushRanges[posLabel] || pushRanges["MP"]

    return {
      style: "Push/Fold",
      styleColor: "text-red-400",
      pushRange: range,
      actions: [
        {
          action: "ALL-IN (Push)",
          color: "text-red-300",
          bg: "bg-red-950/40",
          border: "border-red-500/40",
          hands: range,
          reasoning: `Com ${bbs.toFixed(1)} BBs no ${posLabel}, você está em modo Push/Fold. Não há espaço para abrir e dobrar — vá all-in ou fold direto.`,
          priority: "primary",
        },
        {
          action: "FOLD",
          color: "text-zinc-400",
          bg: "bg-zinc-900/40",
          border: "border-zinc-700/40",
          hands: "Qualquer outra mão",
          reasoning: "Mãos fora do range de push devem ser descartadas sem hesitação.",
          priority: "secondary",
        },
      ],
      keyTips: [
        `Stack crítico: ${bbs.toFixed(1)} BBs — cada órbita que você espera custa fichas`,
        onBubble ? "Na bolha: endure um pouco mais se tiver stack médio-curto para chegar no dinheiro" : "Fora da bolha: abra o range de push — sobreviver não é suficiente",
        "Nunca faça open-raise pequeno com menos de 15 BBs — é ineficiente",
        `No ${posLabel}: ${isLP ? "você tem posição, use-a para pressionar os blinds" : "aguarde mãos mais fortes antes de arriscar"}`,
      ],
    }
  }

  // ── SHORT STACK: 13-25 BB ───────────────────────────────────────────
  if (bbs < 25) {
    const actions: ActionRec[] = []

    if (isLP) {
      actions.push({
        action: "RAISE / JAM",
        color: "text-orange-300",
        bg: "bg-orange-950/40",
        border: "border-orange-500/40",
        hands: "ATo+, A5s-A2s, KJo+, KTs+, QJs, JTs, 77+",
        reasoning: `No ${posLabel} com ${bbs.toFixed(1)} BBs, abra 2.2x com mãos fortes. Se alguém 3-bet, vá all-in (jam-or-fold). Não chame 3-bets.`,
        priority: "primary",
      })
      actions.push({
        action: "FOLD",
        color: "text-zinc-400",
        bg: "bg-zinc-900/40",
        border: "border-zinc-700/40",
        hands: "Mãos médias/fracas fora de posição",
        reasoning: "Stacks curtos não têm margem para jogar mãos especulativas.",
        priority: "secondary",
      })
    } else if (isBB_SB) {
      actions.push({
        action: "3-BET JAM",
        color: "text-orange-300",
        bg: "bg-orange-950/40",
        border: "border-orange-500/40",
        hands: "QQ+, AKs, AKo | Blefes: A5s, A4s, 55-77",
        reasoning: "Contra opens, 3-bet all-in com valor e alguns blefes semi-suited. Não chame fora de posição.",
        priority: "primary",
      })
      actions.push({
        action: "FOLD",
        color: "text-zinc-400",
        bg: "bg-zinc-900/40",
        border: "border-zinc-700/40",
        hands: "Mãos médias (KJo, QJs fora de posição)",
        reasoning: "Chamar fora de posição com stack curto é armadilha — fold ou jam.",
        priority: "secondary",
      })
    } else {
      actions.push({
        action: "RAISE / JAM",
        color: "text-yellow-300",
        bg: "bg-yellow-950/40",
        border: "border-yellow-500/40",
        hands: "AJo+, ATs+, KQs, KQo, 99+",
        reasoning: `No ${posLabel} (posição inicial/média) com ${bbs.toFixed(1)} BBs, abra apenas mãos fortes. Prefira jam direto para evitar 3-bets constrangedores.`,
        priority: "primary",
      })
      actions.push({
        action: "FOLD",
        color: "text-zinc-400",
        bg: "bg-zinc-900/40",
        border: "border-zinc-700/40",
        hands: "Mãos especulativas, connectors, suited one-gappers",
        reasoning: "Sem stack para ver flops baratos — descarte.",
        priority: "secondary",
      })
    }

    return {
      style: "Short Stack",
      styleColor: "text-orange-400",
      pushRange: null,
      actions,
      keyTips: [
        `${bbs.toFixed(1)} BBs: jogo simplificado — jam-or-fold contra 3-bets sempre`,
        onBubble ? "⚠️ Bolha: aperte o range de open, mas não deixe os blinds destruírem seu stack" : "Fora da bolha: seja agressivo, construa stack",
        "Aberturas de 2x-2.2x são ideais para preservar pressão fold equity",
        "NUNCA chame all-ins com mãos fracas esperando sorte — é matematicamente ruim",
      ],
    }
  }

  // ── MÉDIO STACK: 25-50 BB ──────────────────────────────────────────
  if (bbs < 50) {
    const actions: ActionRec[] = []

    if (isLP) {
      actions.push({
        action: "RAISE 2.5x",
        color: "text-blue-300",
        bg: "bg-blue-950/40",
        border: "border-blue-500/40",
        hands: isLP ? "Amplo: A2s+, KJo+, K9s+, QTo+, Q9s+, J9s+, T9s, 98s, 22+" : "Médio: ATo+, KJs+, KQo, JJ+",
        reasoning: `${posLabel}: abra com raises de 2.5x. Tenha plano para 3-bets: fold mãos médias, jam com premium+, call raramente.`,
        priority: "primary",
      })
      actions.push({
        action: "3-BET",
        color: "text-emerald-300",
        bg: "bg-emerald-950/40",
        border: "border-emerald-500/40",
        hands: "AA, KK, QQ, AKs (valor) | A5s, A4s, KQs (blefe)",
        reasoning: "3-bet para isolamento e proteção de range. Tamanho: 3x o open IP, 4x OOP.",
        priority: "secondary",
      })
      actions.push({
        action: "FOLD / CALL",
        color: "text-zinc-400",
        bg: "bg-zinc-900/40",
        border: "border-zinc-700/40",
        hands: "Connectors suited (call IP) | mãos fracas (fold OOP)",
        reasoning: "Connectors suited têm equity implícita apenas em posição. Fora de posição, fold.",
        priority: "secondary",
      })
    } else {
      actions.push({
        action: "RAISE 2.5x",
        color: "text-blue-300",
        bg: "bg-blue-950/40",
        border: "border-blue-500/40",
        hands: "AJo+, ATs+, KQs, KQo, TT+",
        reasoning: `No ${posLabel} (EP/MP), jogue tight. Abra apenas mãos que aguentam 3-bet ou que dominam calls.`,
        priority: "primary",
      })
      actions.push({
        action: "FOLD",
        color: "text-zinc-400",
        bg: "bg-zinc-900/40",
        border: "border-zinc-700/40",
        hands: "Suited connectors, mãos médias fora de posição",
        reasoning: "Em EP/MP você é explorado por ranges de 3-bet mais amplos dos jogadores posteriores.",
        priority: "secondary",
      })
    }

    if (isBB_SB) {
      actions.unshift({
        action: "DEFEND / 3-BET",
        color: "text-purple-300",
        bg: "bg-purple-950/40",
        border: "border-purple-500/40",
        hands: "BB defend: 30-40% range. SB: fold ou 3-bet (não call)",
        reasoning: posLabel === "BB"
          ? "BB tem pot odds para defender amplo. Calcule: você precisa de ~28% equity para call um open 2.5x."
          : "SB nunca chame aberturas — está em pior posição pós-flop. Fold ou 3-bet sempre.",
        priority: "primary",
      })
    }

    return {
      style: "Stack Médio",
      styleColor: "text-blue-400",
      pushRange: null,
      actions,
      keyTips: [
        onBubble ? "⚠️ Bolha com stack médio: IDEAL — pressione os stacks curtos, evite confrontar big stacks" : `${bbs.toFixed(1)} BBs: stack saudável — jogo completo, mas atenção a 3-bets`,
        "Tamanho de raise padrão: 2.5x BB (tournament). Não levante 3x+ sem necessidade",
        "Contra 3-bet: fold mãos médias (KJo, QJs), jam premium (QQ+, AKs), raramente chame",
        itm ? "✓ ITM: agora é hora de acumular fichas, não de sobreviver — seja agressivo" : `${bubbleDistance} jogadores da bolha: avalie risco vs reward de cada confronto`,
      ],
    }
  }

  // ── DEEP STACK: 50+ BB ─────────────────────────────────────────────
  return {
    style: "Deep Stack",
    styleColor: "text-emerald-400",
    pushRange: null,
    actions: [
      {
        action: "RAISE 2.5x",
        color: "text-emerald-300",
        bg: "bg-emerald-950/40",
        border: "border-emerald-500/40",
        hands: isLP ? "Amplo: 40-60% mãos no BTN/CO" : "Selecionado: AJo+, 99+, suited connectors fortes em MP",
        reasoning: `Com ${bbs.toFixed(1)} BBs você tem espaço para jogar poker completo. Varie tamanho de raise (2x-3x) para balancear range.`,
        priority: "primary",
      },
      {
        action: "3-BET / 4-BET",
        color: "text-yellow-300",
        bg: "bg-yellow-950/40",
        border: "border-yellow-500/40",
        hands: "Valor: AA, KK, QQ, AKs | Blefes: A5s, A4s, KQs (IP)",
        reasoning: "Deep stack permite 3-bets e 4-bets sem comprometer todo o stack. Mantenha equilíbrio valor/blefe.",
        priority: "secondary",
      },
      {
        action: "CALL / SETMINE",
        color: "text-blue-300",
        bg: "bg-blue-950/40",
        border: "border-blue-500/40",
        hands: "22-55 (setmine), suited connectors (T9s, 87s) em posição",
        reasoning: "Deep stack = equity implícita. Pares baixos e connectors suited têm valor para fazer sets/straights/flushes.",
        priority: "secondary",
      },
    ],
    keyTips: [
      `${bbs.toFixed(1)} BBs: jogo completo — explore posição, pot odds e equity implícita`,
      onBubble ? "⚠️ Bolha com big stack: DOMINANTE — pressione TODOS os stacks curtos agressivamente, eles não podem jogar de volta" : "Construa potes em posição, evite confrontos fora de posição sem mãos premium",
      "Varie tamanhos: 2x com mãos fortes IP, 3x com blefes OOP para polarizar",
      "Faça setmine com pares baixos quando pot odds > 15:1 (deep stack viabiliza)",
    ],
  }
}

function GTOAnalysis(props: GTOProps) {
  const analysis = analyzeGTO(props)
  const posLabel = getPositionLabel(props.position, props.tableSize)

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-emerald-500/5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20">
            <Target className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-black text-white uppercase tracking-wider">Análise GTO da Situação</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              Posição: <span className="text-emerald-400 font-bold">{posLabel}</span> ·
              Stack: <span className={cn("font-bold", analysis.styleColor)}>{props.bbs.toFixed(1)} BBs</span> ·
              Modo: <span className={cn("font-bold", analysis.styleColor)}>{analysis.style}</span>
            </p>
          </div>
        </div>
        <span className={cn("text-sm font-black px-3 py-1 rounded-full border", analysis.styleColor,
          analysis.styleColor.includes("red") ? "bg-red-950/40 border-red-500/30" :
          analysis.styleColor.includes("orange") ? "bg-orange-950/40 border-orange-500/30" :
          analysis.styleColor.includes("blue") ? "bg-blue-950/40 border-blue-500/30" :
          "bg-emerald-950/40 border-emerald-500/30"
        )}>
          {analysis.style}
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Push Range Banner */}
        {analysis.pushRange && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/30 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-2">⚡ Range de Push — {posLabel}</p>
            <p className="text-sm font-bold text-white font-mono">{analysis.pushRange}</p>
          </div>
        )}

        {/* Action Recommendations */}
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Ações Recomendadas</p>
          {analysis.actions.map((rec, i) => (
            <div key={i} className={cn("rounded-xl border p-4 space-y-2", rec.bg, rec.border)}>
              <div className="flex items-center gap-2">
                {rec.priority === "primary" && <span className="text-[9px] font-black bg-white/10 px-2 py-0.5 rounded-full text-white">PRIMÁRIA</span>}
                {rec.priority === "secondary" && <span className="text-[9px] font-black bg-white/5 px-2 py-0.5 rounded-full text-zinc-500">SECUNDÁRIA</span>}
                <span className={cn("text-sm font-black", rec.color)}>{rec.action}</span>
              </div>
              <p className="text-[11px] font-bold text-zinc-300">
                <span className="text-zinc-500">Mãos: </span>{rec.hands}
              </p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{rec.reasoning}</p>
            </div>
          ))}
        </div>

        {/* Key Tips */}
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Pontos-chave da Situação</p>
          <ul className="space-y-2">
            {analysis.keyTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

