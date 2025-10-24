import { create } from 'zustand'
import { v4 as uuid } from 'uuid'

type Player = { id: string; name: string }

type State = {
  players: Player[]
  add: (name: string) => void
  remove: (id: string) => void
  reset: () => void
}

export const usePlayers = create<State>((set) => ({
  players: [],
  add: (name) => set(s => ({ players: [...s.players, { id: uuid(), name }] })),
  remove: (id) => set(s => ({ players: s.players.filter(p => p.id !== id) })),
  reset: () => set({ players: [] })
}))
