import Card from '../components/Card'
import Toggle from '../components/Toggle'
import { useSettings } from '../state/settings'

export default function Settings() {
  const s = useSettings()
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <h2 className="text-xl font-bold mb-2">Game</h2>
        <Label>Round length (seconds)
          <input type="number" min={30} max={180}
                 className="w-full mt-1 px-3 py-2 rounded bg-slate-900"
                 value={s.roundMs/1000}
                 onChange={e => s.set({ roundMs: Math.max(10, Number(e.target.value)) * 1000 })} />
        </Label>
        <Label>Rounds per player
          <input type="number" min={1} max={10}
                 className="w-full mt-1 px-3 py-2 rounded bg-slate-900"
                 value={s.roundsPerPlayer}
                 onChange={e => s.set({ roundsPerPlayer: Math.max(1, Number(e.target.value)) })} />
        </Label>
        <div className="mt-3">
          <Toggle label="Sounds" checked={s.sounds} onChange={(v)=>s.set({ sounds: v })} />
        </div>
      </Card>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block mb-3">{children}</label>
}
