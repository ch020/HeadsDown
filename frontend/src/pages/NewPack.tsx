import { useState } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import { usePacks } from '../state/packs'
import { v4 as uuid } from 'uuid'
import { generatePackWithLLM } from '../lib/llm'
import { useSettings } from '../state/settings'

export default function NewPack() {
  const [name, setName] = useState('')
  const [itemsText, setItemsText] = useState('')
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const { add } = usePacks()
  const settings = useSettings()

  async function createManual() {
    const items = Array.from(new Set(itemsText.split(/\r?\n/).map(s => s.trim()).filter(Boolean)))
    if (!name || items.length < 50) return alert('Please enter a name and at least 50 items.')
    await add({ id: uuid(), name, source: 'manual', items, preview: items.slice(0,3) })
    alert('Pack created!')
    setName(''); setItemsText('')
  }

  async function createAI() {
    if (!name || !topic) return alert('Please enter a name and topic.')
    setLoading(true)
    try {
      const words = await generatePackWithLLM(topic, 300)
      if (words.length < 100) return alert('LLM returned too few items. Adjust settings or try again.')
      await add({ id: uuid(), name, source: 'ai', items: words, preview: words.slice(0,3) })
      alert(`AI Pack "${name}" created (${words.length} items).`)
      setName(''); setTopic('')
    } catch (e:any) {
      alert(e.message ?? 'LLM error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <h2 className="text-xl font-bold mb-3">Manual Pack</h2>
        <input className="w-full mb-2 px-3 py-2 rounded bg-slate-900" placeholder="Pack name"
               value={name} onChange={e=>setName(e.target.value)} />
        <textarea className="w-full h-48 px-3 py-2 rounded bg-slate-900" placeholder="One item per line"
                  value={itemsText} onChange={e=>setItemsText(e.target.value)} />
        <div className="mt-3">
          <Button onClick={createManual}>Save Pack</Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-bold mb-3">AI Pack (BYO API key)</h2>
        <input className="w-full mb-2 px-3 py-2 rounded bg-slate-900" placeholder="Pack name"
               value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full mb-2 px-3 py-2 rounded bg-slate-900" placeholder="Topic (e.g., World Capitals)"
               value={topic} onChange={e=>setTopic(e.target.value)} />
        <div className="text-sm opacity-75 mb-3">
          Uses your Settings → LLM (base URL, model, API key). Requires ~300 items.
        </div>
        <Button disabled={loading} onClick={createAI}>{loading ? 'Generating…' : 'Generate with AI'}</Button>
      </Card>
    </div>
  )
}
