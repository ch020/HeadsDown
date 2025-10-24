import { useGame } from '../state/game'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import { burstWin } from '../lib/confetti'
import { useEffect } from 'react'

export default function Summary() {
  const nav = useNavigate()
  const { game, current, nextRound } = useGame()
  if (!game || !current) return <div>No game</div>

  useEffect(() => { burstWin() }, [])
  const last = game.rounds[game.rounds.length - 1]
  const correct = last?.itemsShown.filter(i => i.status === 'correct') ?? []
  const skipped = last?.itemsShown.filter(i => i.status === 'skipped') ?? []

  function next() {
    // check if finished all rounds
    const totalRounds = game.settings.roundsPerPlayer * game.players.length
    if (game.rounds.length >= totalRounds) {
      nav('/'); alert('Match finished! Winner screen coming in Phase 2+.')
      return
    }
    nextRound(); nav('/play')
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h2 className="text-xl font-bold mb-2">Correct ({correct.length})</h2>
        <ul className="space-y-1">{correct.map((r,i) => <li key={i}>{r.word}</li>)}</ul>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Skipped ({skipped.length})</h2>
        <ul className="space-y-1 opacity-80">{skipped.map((r,i) => <li key={i}>{r.word}</li>)}</ul>
      </div>
      <div className="md:col-span-2">
        <Button onClick={next}>Next Round</Button>
      </div>
    </div>
  )
}
