// Poker hand ranks
export const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const

export type Rank = typeof RANKS[number]

// Action types
export type Action = 'raise' | 'fold' | 'call' | '3bet'

// Table size
export type TableSize = '6max' | '9max' | 'headsup'

export const TABLE_SIZE_LABELS: Record<TableSize, string> = {
  '6max': '6-Max',
  '9max': '9-Max (Mesa Cheia)',
  'headsup': 'Heads-Up',
}

export const TABLE_SIZE_DESCRIPTIONS: Record<TableSize, string> = {
  '6max': '6 jogadores na mesa',
  '9max': '9 jogadores na mesa (mesa cheia)',
  'headsup': '2 jogadores na mesa',
}

// Position types per table size
export type Position6Max = 'UTG' | 'MP' | 'CO' | 'BTN' | 'SB' | 'BB'
export type Position9Max = 'UTG' | 'UTG1' | 'UTG2' | 'LJ' | 'HJ' | 'CO' | 'BTN' | 'SB' | 'BB'
export type PositionHU = 'BTN' | 'BB'
export type Position = Position6Max | Position9Max | PositionHU

export const POSITIONS_BY_TABLE: Record<TableSize, Position[]> = {
  '6max': ['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB'],
  '9max': ['UTG', 'UTG1', 'UTG2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
  'headsup': ['BTN', 'BB'],
}

export const POSITION_LABELS: Record<Position, string> = {
  UTG: 'Under the Gun (UTG)',
  UTG1: 'UTG+1',
  UTG2: 'UTG+2',
  LJ: 'Lojack (LJ)',
  HJ: 'Hijack (HJ)',
  MP: 'Posicao do Meio (MP)',
  CO: 'Cutoff (CO)',
  BTN: 'Botao (BTN)',
  SB: 'Small Blind (SB)',
  BB: 'Big Blind (BB)',
}

// Build the 13x13 hand grid
export function getHandLabel(row: number, col: number): string {
  if (row === col) return `${RANKS[row]}${RANKS[col]}`
  if (row < col) return `${RANKS[row]}${RANKS[col]}s`
  return `${RANKS[col]}${RANKS[row]}o`
}

export function getHandType(row: number, col: number): 'pair' | 'suited' | 'offsuit' {
  if (row === col) return 'pair'
  if (row < col) return 'suited'
  return 'offsuit'
}

// Scenario types
export type Scenario = 'RFI' | 'vs3Bet' | 'facing3Bet'

export const SCENARIO_LABELS: Record<Scenario, string> = {
  RFI: 'Abrir a Mao (RFI)',
  vs3Bet: 'Contra um Raise (Call / 3-Bet)',
  facing3Bet: 'Contra um 3-Bet',
}

export const SCENARIO_DESCRIPTIONS: Record<Scenario, string> = {
  RFI: 'Ninguem abriu antes de voce. Voce deve dar raise ou fold?',
  vs3Bet: 'Um jogador abriu com raise. Voce deve dar call, 3-bet ou fold?',
  facing3Bet: 'Voce deu raise e alguem fez 3-bet. Voce deve dar call, fold ou 4-bet?',
}

// ====== RANGE BUILDER HELPERS ======

function buildRFIRange(raiseHands: string[]): Record<string, Action> {
  const range: Record<string, Action> = {}
  for (let row = 0; row < 13; row++) {
    for (let col = 0; col < 13; col++) {
      const label = getHandLabel(row, col)
      range[label] = raiseHands.includes(label) ? 'raise' : 'fold'
    }
  }
  return range
}

function buildVsRaiseRange(threeBetHands: string[], callHands: string[]): Record<string, Action> {
  const range: Record<string, Action> = {}
  for (let row = 0; row < 13; row++) {
    for (let col = 0; col < 13; col++) {
      const label = getHandLabel(row, col)
      if (threeBetHands.includes(label)) {
        range[label] = '3bet'
      } else if (callHands.includes(label)) {
        range[label] = 'call'
      } else {
        range[label] = 'fold'
      }
    }
  }
  return range
}

function buildFacing3BetRange(fourBetHands: string[], callHands: string[]): Record<string, Action> {
  const range: Record<string, Action> = {}
  for (let row = 0; row < 13; row++) {
    for (let col = 0; col < 13; col++) {
      const label = getHandLabel(row, col)
      if (fourBetHands.includes(label)) {
        range[label] = 'raise'
      } else if (callHands.includes(label)) {
        range[label] = 'call'
      } else {
        range[label] = 'fold'
      }
    }
  }
  return range
}

// ====== 6-MAX RANGES ======

const RFI_6MAX: Record<Position, Record<string, Action>> = {
  UTG: buildRFIRange([
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77',
    'AKs', 'AQs', 'AJs', 'ATs', 'A5s', 'A4s', 'A3s', 'A2s',
    'KQs', 'KJs', 'KTs',
    'QJs', 'QTs',
    'JTs', 'J9s',
    'T9s', '98s', '87s', '76s', '65s',
    'AKo', 'AQo',
  ]),
  MP: buildRFIRange([
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66',
    'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A5s', 'A4s', 'A3s', 'A2s',
    'KQs', 'KJs', 'KTs', 'K9s',
    'QJs', 'QTs', 'Q9s',
    'JTs', 'J9s',
    'T9s', 'T8s', '98s', '87s', '76s', '65s', '54s',
    'AKo', 'AQo', 'AJo', 'KQo',
  ]),
  CO: buildRFIRange([
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55',
    'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
    'KQs', 'KJs', 'KTs', 'K9s', 'K8s',
    'QJs', 'QTs', 'Q9s', 'Q8s',
    'JTs', 'J9s', 'J8s',
    'T9s', 'T8s', '98s', '97s', '87s', '86s', '76s', '75s', '65s', '64s', '54s', '53s', '43s',
    'AKo', 'AQo', 'AJo', 'ATo', 'KQo', 'KJo', 'QJo', 'JTo',
  ]),
  BTN: buildRFIRange([
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
    'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
    'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s',
    'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s',
    'JTs', 'J9s', 'J8s', 'J7s',
    'T9s', 'T8s', 'T7s', '98s', '97s', '96s', '87s', '86s', '85s', '76s', '75s', '65s', '64s', '54s', '53s', '43s', '32s',
    'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o',
    'KQo', 'KJo', 'KTo', 'K9o',
    'QJo', 'QTo', 'Q9o',
    'JTo', 'J9o', 'T9o', 'T8o', '98o', '97o', '87o', '76o', '65o',
  ]),
  SB: buildRFIRange([
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
    'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
    'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s',
    'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s',
    'JTs', 'J9s', 'J8s', 'J7s',
    'T9s', 'T8s', 'T7s', '98s', '97s', '96s', '87s', '86s', '76s', '75s', '65s', '64s', '54s', '53s', '43s',
    'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o',
    'KQo', 'KJo', 'KTo', 'K9o',
    'QJo', 'QTo', 'Q9o',
    'JTo', 'J9o', 'T9o', 'T8o', '98o', '87o', '76o',
  ]),
  BB: buildRFIRange([]),
  // 9-max positions (not used in 6max, but needed for type safety)
  UTG1: buildRFIRange([]),
  UTG2: buildRFIRange([]),
  LJ: buildRFIRange([]),
  HJ: buildRFIRange([]),
}

const VS_RAISE_6MAX: Record<Position, Record<string, Action>> = {
  UTG: buildVsRaiseRange([], []),
  MP: buildVsRaiseRange(
    ['AA', 'KK', 'QQ', 'AKs', 'AKo'],
    ['JJ', 'TT', '99', '88', '77', 'AQs', 'AJs', 'ATs', 'KQs', 'KJs', 'QJs', 'JTs', 'T9s', '98s', '87s', '76s', '65s', 'AQo']
  ),
  CO: buildVsRaiseRange(
    ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo', 'AQs'],
    ['TT', '99', '88', '77', '66', 'AJs', 'ATs', 'A9s', 'A5s', 'A4s', 'KQs', 'KJs', 'KTs', 'QJs', 'QTs', 'JTs', 'J9s', 'T9s', '98s', '87s', '76s', '65s', '54s', 'AQo', 'AJo', 'KQo']
  ),
  BTN: buildVsRaiseRange(
    ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'A5s', 'A4s'],
    ['99', '88', '77', '66', '55', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A3s', 'A2s', 'KQs', 'KJs', 'KTs', 'K9s', 'QJs', 'QTs', 'Q9s', 'JTs', 'J9s', 'T9s', 'T8s', '98s', '97s', '87s', '86s', '76s', '75s', '65s', '64s', '54s', 'AJo', 'ATo', 'KQo', 'KJo', 'QJo', 'JTo']
  ),
  SB: buildVsRaiseRange(
    ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'A5s'],
    ['99', '88', '77', 'ATs', 'A9s', 'A8s', 'A4s', 'A3s', 'KQs', 'KJs', 'KTs', 'QJs', 'QTs', 'JTs', 'T9s', '98s', '87s', '76s', '65s', 'AJo', 'KQo']
  ),
  BB: buildVsRaiseRange(
    ['AA', 'KK', 'QQ', 'AKs', 'AKo', 'AQs'],
    ['JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'QJs', 'QTs', 'Q9s', 'Q8s', 'JTs', 'J9s', 'J8s', 'T9s', 'T8s', '98s', '97s', '87s', '86s', '76s', '75s', '65s', '64s', '54s', '53s', '43s', 'AQo', 'AJo', 'ATo', 'A9o', 'KQo', 'KJo', 'KTo', 'QJo', 'QTo', 'JTo', 'T9o', '98o']
  ),
  UTG1: buildVsRaiseRange([], []),
  UTG2: buildVsRaiseRange([], []),
  LJ: buildVsRaiseRange([], []),
  HJ: buildVsRaiseRange([], []),
}

const FACING_3BET_6MAX: Record<Position, Record<string, Action>> = {
  UTG: buildFacing3BetRange(
    ['AA', 'KK', 'AKs'],
    ['QQ', 'JJ', 'TT', 'AQs', 'AJs', 'AKo', 'KQs']
  ),
  MP: buildFacing3BetRange(
    ['AA', 'KK', 'AKs'],
    ['QQ', 'JJ', 'TT', '99', 'AQs', 'AJs', 'ATs', 'AKo', 'KQs', 'AQo']
  ),
  CO: buildFacing3BetRange(
    ['AA', 'KK', 'QQ', 'AKs', 'AKo'],
    ['JJ', 'TT', '99', '88', 'AQs', 'AJs', 'ATs', 'A5s', 'A4s', 'KQs', 'KJs', 'QJs', 'JTs', 'T9s', '98s', 'AQo', 'AJo']
  ),
  BTN: buildFacing3BetRange(
    ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo', 'AQs'],
    ['TT', '99', '88', '77', 'AJs', 'ATs', 'A9s', 'A5s', 'A4s', 'A3s', 'KQs', 'KJs', 'KTs', 'QJs', 'QTs', 'JTs', 'J9s', 'T9s', '98s', '87s', '76s', 'AQo', 'AJo', 'ATo', 'KQo']
  ),
  SB: buildFacing3BetRange(
    ['AA', 'KK', 'QQ', 'AKs', 'AKo'],
    ['JJ', 'TT', '99', '88', 'AQs', 'AJs', 'ATs', 'A5s', 'A4s', 'KQs', 'KJs', 'QJs', 'JTs', 'T9s', '98s', 'AQo', 'AJo', 'KQo']
  ),
  // BB squeezed/3-bet and faces a 4-bet — GTO range: 4-bet with premiums + bluffs (A5s/A4s blockers)
  BB: buildFacing3BetRange(
    ['AA', 'KK', 'AKs', 'A5s', 'A4s'],
    ['QQ', 'JJ', 'TT', 'AKo', 'AQs', 'AJs', 'KQs']
  ),
  UTG1: buildFacing3BetRange([], []),
  UTG2: buildFacing3BetRange([], []),
  LJ: buildFacing3BetRange([], []),
  HJ: buildFacing3BetRange([], []),
}

// ====== 9-MAX RANGES (Full Ring - tighter) ======

const RFI_9MAX: Record<Position, Record<string, Action>> = {
  UTG: buildRFIRange([
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99',
    'AKs', 'AQs', 'AJs', 'ATs',
    'KQs', 'KJs',
    'QJs',
    'JTs',
    'AKo',
  ]),
  UTG1: buildRFIRange([
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88',
    'AKs', 'AQs', 'AJs', 'ATs', 'A5s',
    'KQs', 'KJs', 'KTs',
    'QJs', 'QTs',
    'JTs',
    'T9s',
    'AKo', 'AQo',
  ]),
  UTG2: buildRFIRange([
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77',
    'AKs', 'AQs', 'AJs', 'ATs', 'A5s', 'A4s',
    'KQs', 'KJs', 'KTs',
    'QJs', 'QTs',
    'JTs', 'J9s',
    'T9s', '98s', '87s', '76s',
    'AKo', 'AQo',
  ]),
  LJ: buildRFIRange([
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66',
    'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A5s', 'A4s', 'A3s', 'A2s',
    'KQs', 'KJs', 'KTs', 'K9s',
    'QJs', 'QTs', 'Q9s',
    'JTs', 'J9s',
    'T9s', 'T8s', '98s', '87s', '76s', '65s', '54s',
    'AKo', 'AQo', 'AJo', 'KQo',
  ]),
  HJ: buildRFIRange([
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55',
    'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A5s', 'A4s', 'A3s', 'A2s',
    'KQs', 'KJs', 'KTs', 'K9s', 'K8s',
    'QJs', 'QTs', 'Q9s',
    'JTs', 'J9s', 'J8s',
    'T9s', 'T8s', '98s', '97s', '87s', '86s', '76s', '75s', '65s', '64s', '54s', '53s', '43s',
    'AKo', 'AQo', 'AJo', 'ATo', 'KQo', 'KJo', 'QJo',
  ]),
  CO: buildRFIRange([
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44',
    'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
    'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s',
    'QJs', 'QTs', 'Q9s', 'Q8s',
    'JTs', 'J9s', 'J8s',
    'T9s', 'T8s', 'T7s', '98s', '97s', '87s', '86s', '76s', '75s', '65s', '64s', '54s', '53s', '43s',
    'AKo', 'AQo', 'AJo', 'ATo', 'A9o',
    'KQo', 'KJo', 'KTo',
    'QJo', 'QTo', 'JTo',
  ]),
  BTN: buildRFIRange([
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
    'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
    'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s',
    'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s',
    'JTs', 'J9s', 'J8s', 'J7s',
    'T9s', 'T8s', 'T7s', '98s', '97s', '96s', '87s', '86s', '85s', '76s', '75s', '65s', '64s', '54s', '53s', '43s', '32s',
    'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o',
    'KQo', 'KJo', 'KTo', 'K9o',
    'QJo', 'QTo', 'Q9o',
    'JTo', 'J9o', 'T9o', 'T8o', '98o', '97o', '87o', '76o', '65o',
  ]),
  SB: buildRFIRange([
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
    'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
    'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s',
    'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s',
    'JTs', 'J9s', 'J8s', 'J7s',
    'T9s', 'T8s', 'T7s', '98s', '97s', '96s', '87s', '86s', '76s', '75s', '65s', '64s', '54s', '53s', '43s',
    'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o',
    'KQo', 'KJo', 'KTo', 'K9o',
    'QJo', 'QTo', 'Q9o',
    'JTo', 'J9o', 'T9o', 'T8o', '98o', '87o', '76o',
  ]),
  BB: buildRFIRange([]),
  MP: buildRFIRange([]),
}

const VS_RAISE_9MAX: Record<Position, Record<string, Action>> = {
  UTG: buildVsRaiseRange([], []),
  UTG1: buildVsRaiseRange(
    ['AA', 'KK', 'QQ', 'AKs'],
    ['JJ', 'TT', '99', 'AQs', 'AJs', 'AKo', 'KQs']
  ),
  UTG2: buildVsRaiseRange(
    ['AA', 'KK', 'QQ', 'AKs', 'AKo'],
    ['JJ', 'TT', '99', '88', 'AQs', 'AJs', 'ATs', 'KQs', 'KJs', 'QJs', 'JTs', 'AQo']
  ),
  LJ: buildVsRaiseRange(
    ['AA', 'KK', 'QQ', 'AKs', 'AKo'],
    ['JJ', 'TT', '99', '88', '77', 'AQs', 'AJs', 'ATs', 'A5s', 'KQs', 'KJs', 'KTs', 'QJs', 'QTs', 'JTs', 'T9s', '98s', '87s', '76s', '65s', 'AQo', 'AJo', 'KQo']
  ),
  HJ: buildVsRaiseRange(
    ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo', 'AQs'],
    ['TT', '99', '88', '77', '66', 'AJs', 'ATs', 'A9s', 'A5s', 'A4s', 'KQs', 'KJs', 'KTs', 'QJs', 'QTs', 'JTs', 'J9s', 'T9s', '98s', '87s', '76s', '65s', '54s', 'AQo', 'AJo', 'KQo']
  ),
  CO: buildVsRaiseRange(
    ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo', 'AQs', 'AJs'],
    ['TT', '99', '88', '77', '66', '55', 'ATs', 'A9s', 'A8s', 'A5s', 'A4s', 'KQs', 'KJs', 'KTs', 'K9s', 'QJs', 'QTs', 'Q9s', 'JTs', 'J9s', 'T9s', 'T8s', '98s', '97s', '87s', '86s', '76s', '75s', '65s', '54s', 'AQo', 'AJo', 'ATo', 'KQo', 'KJo', 'QJo']
  ),
  BTN: buildVsRaiseRange(
    ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'A5s', 'A4s'],
    ['99', '88', '77', '66', '55', '44', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A3s', 'A2s', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'QJs', 'QTs', 'Q9s', 'JTs', 'J9s', 'J8s', 'T9s', 'T8s', '98s', '97s', '87s', '86s', '76s', '75s', '65s', '64s', '54s', '53s', 'AJo', 'ATo', 'A9o', 'KQo', 'KJo', 'KTo', 'QJo', 'QTo', 'JTo']
  ),
  SB: buildVsRaiseRange(
    ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'A5s'],
    ['99', '88', '77', 'ATs', 'A9s', 'A8s', 'A4s', 'A3s', 'KQs', 'KJs', 'KTs', 'QJs', 'QTs', 'JTs', 'T9s', '98s', '87s', '76s', '65s', 'AJo', 'KQo']
  ),
  BB: buildVsRaiseRange(
    ['AA', 'KK', 'QQ', 'AKs', 'AKo', 'AQs'],
    ['JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'JTs', 'J9s', 'J8s', 'T9s', 'T8s', '98s', '97s', '87s', '86s', '76s', '75s', '65s', '64s', '54s', '53s', '43s', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'KQo', 'KJo', 'KTo', 'K9o', 'QJo', 'QTo', 'JTo', 'T9o', '98o', '87o']
  ),
  MP: buildVsRaiseRange([], []),
}

const FACING_3BET_9MAX: Record<Position, Record<string, Action>> = {
  UTG: buildFacing3BetRange(
    ['AA', 'KK'],
    ['QQ', 'JJ', 'AKs', 'AQs', 'AKo']
  ),
  UTG1: buildFacing3BetRange(
    ['AA', 'KK', 'AKs'],
    ['QQ', 'JJ', 'TT', 'AQs', 'AJs', 'AKo', 'KQs']
  ),
  UTG2: buildFacing3BetRange(
    ['AA', 'KK', 'AKs'],
    ['QQ', 'JJ', 'TT', '99', 'AQs', 'AJs', 'ATs', 'AKo', 'KQs', 'AQo']
  ),
  LJ: buildFacing3BetRange(
    ['AA', 'KK', 'QQ', 'AKs', 'AKo'],
    ['JJ', 'TT', '99', 'AQs', 'AJs', 'ATs', 'A5s', 'KQs', 'KJs', 'QJs', 'JTs', 'AQo', 'AJo']
  ),
  HJ: buildFacing3BetRange(
    ['AA', 'KK', 'QQ', 'AKs', 'AKo'],
    ['JJ', 'TT', '99', '88', 'AQs', 'AJs', 'ATs', 'A5s', 'A4s', 'KQs', 'KJs', 'QJs', 'JTs', 'T9s', '98s', 'AQo', 'AJo']
  ),
  CO: buildFacing3BetRange(
    ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo', 'AQs'],
    ['TT', '99', '88', '77', 'AJs', 'ATs', 'A9s', 'A5s', 'A4s', 'A3s', 'KQs', 'KJs', 'KTs', 'QJs', 'QTs', 'JTs', 'J9s', 'T9s', '98s', '87s', 'AQo', 'AJo', 'ATo', 'KQo']
  ),
  BTN: buildFacing3BetRange(
    ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo', 'AQs'],
    ['TT', '99', '88', '77', 'AJs', 'ATs', 'A9s', 'A5s', 'A4s', 'A3s', 'KQs', 'KJs', 'KTs', 'QJs', 'QTs', 'JTs', 'J9s', 'T9s', '98s', '87s', '76s', 'AQo', 'AJo', 'ATo', 'KQo']
  ),
  SB: buildFacing3BetRange(
    ['AA', 'KK', 'QQ', 'AKs', 'AKo'],
    ['JJ', 'TT', '99', '88', 'AQs', 'AJs', 'ATs', 'A5s', 'A4s', 'KQs', 'KJs', 'QJs', 'JTs', 'T9s', '98s', 'AQo', 'AJo', 'KQo']
  ),
  // BB squeezed and faces a 4-bet — tighter than 6-max (full ring)
  BB: buildFacing3BetRange(
    ['AA', 'KK', 'AKs', 'A5s'],
    ['QQ', 'JJ', 'AKo', 'AQs', 'AJs']
  ),
  MP: buildFacing3BetRange([], []),
}

// ====== HEADS-UP RANGES ======

const RFI_HU: Record<Position, Record<string, Action>> = {
  BTN: buildRFIRange([
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
    'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
    'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s',
    'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'Q4s', 'Q3s',
    'JTs', 'J9s', 'J8s', 'J7s', 'J6s', 'J5s',
    'T9s', 'T8s', 'T7s', 'T6s',
    '98s', '97s', '96s', '95s',
    '87s', '86s', '85s',
    '76s', '75s', '74s',
    '65s', '64s', '63s',
    '54s', '53s', '52s',
    '43s', '42s',
    '32s',
    'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o', 'A4o', 'A3o', 'A2o',
    'KQo', 'KJo', 'KTo', 'K9o', 'K8o', 'K7o', 'K6o',
    'QJo', 'QTo', 'Q9o', 'Q8o', 'Q7o',
    'JTo', 'J9o', 'J8o', 'J7o',
    'T9o', 'T8o', 'T7o',
    '98o', '97o', '96o',
    '87o', '86o', '85o',
    '76o', '75o',
    '65o', '64o',
    '54o', '53o',
    '43o',
  ]),
  BB: buildRFIRange([]),
  // Unused positions
  UTG: buildRFIRange([]),
  UTG1: buildRFIRange([]),
  UTG2: buildRFIRange([]),
  LJ: buildRFIRange([]),
  HJ: buildRFIRange([]),
  MP: buildRFIRange([]),
  CO: buildRFIRange([]),
  SB: buildRFIRange([]),
}

const VS_RAISE_HU: Record<Position, Record<string, Action>> = {
  BTN: buildVsRaiseRange([], []),
  BB: buildVsRaiseRange(
    ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'A5s', 'A4s', 'A3s', 'K9s'],
    [
      '99', '88', '77', '66', '55', '44', '33', '22',
      'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A2s',
      'KQs', 'KJs', 'KTs', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s',
      'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s',
      'JTs', 'J9s', 'J8s', 'J7s', 'J6s',
      'T9s', 'T8s', 'T7s', 'T6s',
      '98s', '97s', '96s', '95s',
      '87s', '86s', '85s',
      '76s', '75s', '74s',
      '65s', '64s', '63s',
      '54s', '53s', '52s',
      '43s', '42s',
      '32s',
      'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o', 'A4o', 'A3o', 'A2o',
      'KQo', 'KJo', 'KTo', 'K9o', 'K8o', 'K7o',
      'QJo', 'QTo', 'Q9o', 'Q8o',
      'JTo', 'J9o', 'J8o',
      'T9o', 'T8o',
      '98o', '97o',
      '87o', '86o',
      '76o', '75o',
      '65o', '64o',
      '54o',
    ]
  ),
  UTG: buildVsRaiseRange([], []),
  UTG1: buildVsRaiseRange([], []),
  UTG2: buildVsRaiseRange([], []),
  LJ: buildVsRaiseRange([], []),
  HJ: buildVsRaiseRange([], []),
  MP: buildVsRaiseRange([], []),
  CO: buildVsRaiseRange([], []),
  SB: buildVsRaiseRange([], []),
}

const FACING_3BET_HU: Record<Position, Record<string, Action>> = {
  BTN: buildFacing3BetRange(
    ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AKo', 'AQs', 'A5s', 'A4s'],
    ['99', '88', '77', '66', '55', 'AQo', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A3s', 'A2s', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'QJs', 'QTs', 'Q9s', 'JTs', 'J9s', 'T9s', 'T8s', '98s', '97s', '87s', '86s', '76s', '75s', '65s', '64s', '54s', '53s', '43s', 'AJo', 'ATo', 'A9o', 'KQo', 'KJo', 'KTo', 'QJo', 'QTo', 'JTo']
  ),
  // HU BB 3-bet BTN open, BTN 4-bets — BB has wide 5-bet range in HU
  BB: buildFacing3BetRange(
    ['AA', 'KK', 'QQ', 'AKs', 'A5s', 'A4s', 'A3s'],
    ['JJ', 'TT', '99', 'AKo', 'AQs', 'AJs', 'ATs', 'KQs', 'KJs']
  ),
  UTG: buildFacing3BetRange([], []),
  UTG1: buildFacing3BetRange([], []),
  UTG2: buildFacing3BetRange([], []),
  LJ: buildFacing3BetRange([], []),
  HJ: buildFacing3BetRange([], []),
  MP: buildFacing3BetRange([], []),
  CO: buildFacing3BetRange([], []),
  SB: buildFacing3BetRange([], []),
}

// ====== RANGE RETRIEVAL ======

const RANGES: Record<TableSize, { rfi: Record<Position, Record<string, Action>>; vsRaise: Record<Position, Record<string, Action>>; facing3Bet: Record<Position, Record<string, Action>> }> = {
  '6max': { rfi: RFI_6MAX, vsRaise: VS_RAISE_6MAX, facing3Bet: FACING_3BET_6MAX },
  '9max': { rfi: RFI_9MAX, vsRaise: VS_RAISE_9MAX, facing3Bet: FACING_3BET_9MAX },
  'headsup': { rfi: RFI_HU, vsRaise: VS_RAISE_HU, facing3Bet: FACING_3BET_HU },
}

export function getRangeForScenario(position: Position, scenario: Scenario, tableSize: TableSize = '6max'): Record<string, Action> {
  const tableRanges = RANGES[tableSize]
  switch (scenario) {
    case 'RFI':
      return tableRanges.rfi[position]
    case 'vs3Bet':
      return tableRanges.vsRaise[position]
    case 'facing3Bet':
      return tableRanges.facing3Bet[position]
  }
}

export function getActionLabel(action: Action, scenario: Scenario): string {
  if (scenario === 'RFI') {
    return action === 'raise' ? 'Raise' : 'Desistir'
  }
  if (scenario === 'vs3Bet') {
    if (action === '3bet') return '3-Bet'
    if (action === 'call') return 'Pagar'
    return 'Desistir'
  }
  if (scenario === 'facing3Bet') {
    if (action === 'raise') return '4-Bet'
    if (action === 'call') return 'Pagar'
    return 'Desistir'
  }
  return action
}

export function getActionColor(action: Action): string {
  switch (action) {
    case 'raise': return 'bg-[oklch(0.72_0.19_160)]'
    case '3bet': return 'bg-[oklch(0.75_0.15_55)]'
    case 'call': return 'bg-[oklch(0.6_0.15_250)]'
    case 'fold': return 'bg-[oklch(0.25_0.01_260)]'
  }
}

export function getActionTextColor(action: Action): string {
  switch (action) {
    case 'raise': return 'text-[oklch(0.13_0.005_260)]'
    case '3bet': return 'text-[oklch(0.13_0.005_260)]'
    case 'call': return 'text-[oklch(0.95_0_0)]'
    case 'fold': return 'text-[oklch(0.5_0_0)]'
  }
}

export function getRandomHand(): { row: number; col: number; label: string } {
  const row = Math.floor(Math.random() * 13)
  const col = Math.floor(Math.random() * 13)
  return { row, col, label: getHandLabel(row, col) }
}

export function getRangeStats(range: Record<string, Action>): Record<Action, number> {
  const stats: Record<Action, number> = { raise: 0, fold: 0, call: 0, '3bet': 0 }
  for (const action of Object.values(range)) {
    stats[action]++
  }
  return stats
}

/** Returns the number of card combos for a given hand label */
export function getComboCount(hand: string): number {
  if (hand.length === 2) return 6           // pair: AA, KK...
  if (hand.endsWith('s')) return 4          // suited: AKs...
  return 12                                  // offsuit: AKo...
}

/** Returns combo stats for the whole range */
export function getRangeComboStats(range: Record<string, Action>): Record<Action, number> {
  const stats: Record<Action, number> = { raise: 0, fold: 0, call: 0, '3bet': 0 }
  for (const [hand, action] of Object.entries(range)) {
    stats[action] += getComboCount(hand)
  }
  return stats
}

/** Returns a short strategic tip for a hand in a given scenario */
export function getHandTip(hand: string, action: Action, scenario: Scenario): string {
  const type = hand.length === 2 ? 'par' : hand.endsWith('s') ? 'suited' : 'offsuit'
  const rank1 = hand[0]
  const isPremium = ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo'].includes(hand)
  const isHighCard = ['A', 'K', 'Q'].includes(rank1)

  if (scenario === 'RFI') {
    if (action === 'raise') {
      if (isPremium) return 'Mão premium — sempre abre nessa posição'
      if (type === 'par') return 'Par — bom valor pré-flop, abre sempre'
      if (type === 'suited') return 'Suited — conectores e dois pares possíveis'
      return 'Offsuit com valor suficiente para abrir nessa posição'
    }
    return 'Fora do range de abertura nessa posição — descarta'
  }

  if (scenario === 'vs3Bet') {
    if (action === '3bet') return 'Mão forte o suficiente para 3-bet e isolar o agressor'
    if (action === 'call') return isHighCard
      ? 'Mão com bom valor de showdown — paga e avalia no flop'
      : 'Suited com equity de draw — paga por pot odds'
    return 'Fora do range de defesa — descarta sem punição'
  }

  if (scenario === 'facing3Bet') {
    if (action === 'raise') return 'Mão forte — 4-bet para proteção e valor'
    if (action === 'call') return 'Mão com equity suficiente — chama e joga no flop'
    return 'Fora do range defensivo contra o 3-bet — descarta'
  }

  return ''
}

/**
 * Returns whether a scenario makes strategic sense for a given
 * position and table size. Used to disable irrelevant scenarios in the UI.
 */
export function isScenarioApplicable(position: Position, scenario: Scenario, tableSize: TableSize): boolean {
  // BB has no RFI — they're last to act and already have money in the pot
  if (position === 'BB' && scenario === 'RFI') return false

  // UTG acts before all other players — can't face an open raise
  if (position === 'UTG' && scenario === 'vs3Bet') return false

  // In HU, the BTN/SB acts FIRST preflop — they can't face an open from BB
  if (tableSize === 'headsup' && position === 'BTN' && scenario === 'vs3Bet') return false

  return true
}
