// src/pages/Play.tsx
import { useEffect, useRef, useState } from 'react'
import OrientationGate from '../components/OrientationGate'
import Button from '../components/Button'
import Timer from '../components/Timer'
import useTilt from '../hooks/useTilt'
import { useGame } from '../state/game'
import { useNavigate } from 'react-router-dom'
import { playCorrect, playSkip } from '../lib/audio'
import { useSettings } from '../state/settings'
import {burstSmall} from "../lib/confetti";

export default function Play() {
  const nav = useNavigate()
  const { game, current, mark, finishRound } = useGame()
  const { sounds } = useSettings()

  const [running, setRunning] = useState(false)
  const [countdown, setCountdown] = useState<number>(0) // 0 = no countdown, >0 shows numbers
  const [flash, setFlash] = useState<'correct'|'skip'|null>(null)

  const { event, permission, ensurePermission, start } = useTilt()
  const firedRef = useRef(0)

  useEffect(() => {
    if (!running || !event) return
    const now = performance.now()
    if (now - firedRef.current < 300) return
    firedRef.current = now

    if (event === 'correct') {
      mark('correct')
      if (sounds) playCorrect()
      flashNow('correct')
      burstSmall(0.5, 0.3)
    }
    if (event === 'skip') {
      mark('skipped')
      if (sounds) playSkip()
      flashNow('skip')
      burstSmall(0.5, 0.7)
    }
  }, [event, running])

  function flashNow(kind: 'correct'|'skip') {
    setFlash(kind)
    setTimeout(() => setFlash(null), 220)
  }

  if (!game || !current) return <div>No game</div>

  const player = game.players[current.playerIdx]
  const word = current.words[current.cardIdx] ?? '—'

  async function begin() {
    // 1) Ask for motion permission (tap gesture happens here)
    const res = await ensurePermission()
    if (res !== 'granted') { alert('Motion permission denied.'); return }

    // 2) Start the listener (still not running the round)
    start()

    // 3) Run a 3-2-1 countdown; hide the word during countdown
    setCountdown(3)
    const id = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(id)
          setCountdown(0)
          setRunning(true) // Start the timer only after countdown ends
        }
        return prev - 1
      })
    }, 1000)
  }

  async function end() {
    setRunning(false)
    await finishRound()
    nav('/summary')
  }

  return (
    <OrientationGate>
      <div className="relative h-full flex flex-col">
        {/* Flash overlay */}
        {flash && (
          <div
            className={`absolute inset-0 pointer-events-none ${
              flash === 'correct' ? 'bg-green-500/40' : 'bg-orange-500/40'
            } transition-opacity duration-200`}
          />
        )}

        <div className="flex justify-between items-center">
          <div className="text-lg opacity-80">Player: <b>{player.name}</b></div>
          <Timer ms={game.settings.roundMs} running={running} onDone={end} />
        </div>

        <div className="flex-1 grid place-items-center">
          {countdown > 0 ? (
            <div className="text-7xl font-extrabold">{countdown}</div>
          ) : (
            <div className="text-5xl md:text-7xl text-center font-extrabold select-none">
              {running ? word : 'Ready?'}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center gap-4">
          {!running ? (
            <Button onClick={begin}>
              {permission === 'unknown' ? 'Enable Motion & Start' :
               permission === 'granted' ? 'Start' : 'Grant Motion in Settings'}
            </Button>
          ) : (
            <Button onClick={end}>End</Button>
          )}
          <div className="opacity-70 text-sm">
            Tilt <b>DOWN</b> = Correct • <b>UP</b> = Skip
          </div>
        </div>
      </div>
    </OrientationGate>
  )
}
