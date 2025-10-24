import { useEffect, useState } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import { usePacks } from '../state/packs'
import { usePlayers } from '../state/players'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../state/settings'
import { useGame } from '../state/game'

export default function Lobby() {
  const nav = useNavigate()
  const { list, load } = usePacks()
  const { players, add, remove, reset } = usePlayers()
  const [packId, setPackId] = useState<string>('')
  const settings = useSettings()
  const game = useGame()

  useEffect(() => { load() }, [])

  function start() {
    const pack = list.find(p => p.id === packId)
    if (!pack) return alert('Select a pack')
    if (players.length < 1) return alert('Add at least one player')
    game.start(players, { id: pack.id, name: pack.name, items: pack.items }, settings.roundMs, settings.roundsPerPlayer)
    nav('/play')
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <h2 className="text-xl font-bold mb-2">Players</h2>
        <PlayerForm onAdd={add} />
        <ul className="mt-2 space-y-1">
          {players.map(p => (
            <li key={p.id} className="flex justify-between items-center">
              <span>{p.name}</span>
              <button className="text-red-400" onClick={() => remove(p.id)}>remove</button>
            </li>
          ))}
        </ul>
        {players.length > 0 && <button className="mt-2 text-sm opacity-70" onClick={reset}>reset</button>}
      </Card>

      <Card>
        <h2 className="text-xl font-bold mb-2">Pack & Settings</h2>
        <select className="w-full px-3 py-2 rounded bg-slate-900" value={packId} onChange={e=>setPackId(e.target.value)}>
          <option value="">Select a pack…</option>
          {list.map(p => <option key={p.id} value={p.id}>{p.name} ({p.items.length})</option>)}
        </select>
        <div className="mt-3 text-sm opacity-80">
          Round length: {(settings.roundMs/1000)|0}s • Rounds each: {settings.roundsPerPlayer}
        </div>
        <div className="mt-4">
          <Button onClick={start}>Start Game</Button>
        </div>
      </Card>
    </div>
  )
}

function PlayerForm({ onAdd }: { onAdd: (name: string) => void }) {
  const [name, setName] = useState('')
  return (
    <div className="flex gap-2">
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Player name"
             className="flex-1 px-3 py-2 rounded bg-slate-900" />
      <Button onClick={()=>{ if(name.trim()){onAdd(name.trim()); setName('')} }}>Add</Button>
    </div>
  )
}
