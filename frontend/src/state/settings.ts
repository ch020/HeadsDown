import {create} from 'zustand'

type Settings = {
  roundMs: number
  roundsPerPlayer: number
  sounds: boolean
  set: (patch: Partial<Settings>) => void
}

const defaultSettings: Settings = {
    roundMs: 60000,
    roundsPerPlayer: 2,
    sounds: true,
    set: () => {}
}

export const useSettings = create<Settings>((set) => ({
    ...defaultSettings,
    set: (patch) => set(s => ({ ...s, ...patch }))
}))