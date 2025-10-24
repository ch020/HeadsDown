import { create } from 'zustand'
import { db, Game, ItemResult } from './db'
import { v4 as uuid } from 'uuid'
import { shuffleInPlace } from '../lib/random'

type State = {
  game: Game | null
  current: { playerIdx: number; cardIdx: number; words: string[]; results: ItemResult[] } | null
  start: (players: {id:string; name:string}[], pack: {id:string; name:string; items:string[]}, roundMs: number, roundsPerPlayer: number) => void
  nextRound: () => void
  mark: (status: 'correct'|'skipped') => void
  finishRound: () => Promise<void>
}

export const useGame = create<State>((set, get) => ({
  game: null,
  current: null,
  start: (players, pack, roundMs, roundsPerPlayer) => {
    const words = [...pack.items]
    shuffleInPlace(words)
    set({
      game: { id: uuid(), players, rounds: [], settings: { roundMs, roundsPerPlayer } },
      current: { playerIdx: 0, cardIdx: 0, words, results: [] }
    })
  },
  nextRound: () => {
    const st = get()
    if (!st.game) return
    const nextIdx = ((st.current?.playerIdx ?? 0) + 1) % st.game.players.length
    const words = [...(st.current?.words ?? [])]
    shuffleInPlace(words)
    set({ current: { playerIdx: nextIdx, cardIdx: 0, words, results: [] } })
  },
  mark: (status) => {
    const c = get().current
    if (!c) return
    const word = c.words[c.cardIdx]
    const results = [...c.results, { word, status }]
    set({ current: { ...c, cardIdx: Math.min(c.cardIdx + 1, c.words.length - 1), results } })
  },
  finishRound: async () => {
    const st = get()
    if (!st.game || !st.current) return
    const { players } = st.game
    const player = players[st.current.playerIdx]
    const score = st.current.results.filter(r => r.status === 'correct').length
    st.game.rounds.push({
      playerId: player.id,
      packId: 'n/a',
      itemsShown: st.current.results,
      score,
      durationMs: st.game.settings.roundMs
    })
    await db.games.put(st.game)
    set({ game: st.game })
  }
}))
