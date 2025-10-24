import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import { usePacks } from '../state/packs'
import { useEffect } from 'react'

export default function Home() {
  const { list, load } = usePacks()
  useEffect(() => { load() }, [])

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Start</h2>
            <p className="opacity-75">Pick a pack and add players</p>
          </div>
          <Link to="/lobby"><Button>Go to Lobby</Button></Link>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-bold mb-2">Packs</h2>
        <ul className="space-y-1 max-h-48 overflow-auto">
          {list.map(p => <li key={p.id} className="opacity-90">{p.name} <span className="opacity-60 text-sm">({p.items.length})</span></li>)}
          {list.length === 0 && <li className="opacity-60">No packs yet.</li>}
        </ul>
        <div className="mt-4">
          <Link to="/new-pack"><Button>Create Pack</Button></Link>
        </div>
      </Card>
    </div>
  )
}
