// src/hooks/useTilt.ts
import { useEffect, useRef, useState } from 'react'

export type TiltEvent = 'correct' | 'skip' | null
type Permission = 'unknown' | 'granted' | 'denied'

export async function requestMotionPermission(): Promise<Permission> {
  const w = window as any
  if (w.DeviceMotionEvent && typeof w.DeviceMotionEvent.requestPermission === 'function') {
    try {
      const res = await w.DeviceMotionEvent.requestPermission()
      return res === 'granted' ? 'granted' : 'denied'
    } catch {
      return 'denied'
    }
  }
  return 'granted'
}

/**
 * Normalises a single tilt axis so "down"<0 and "up">0 regardless of landscape orientation.
 * - Portrait: use beta (pitch) directly.
 * - Landscape: use gamma (roll) but flip sign if rotated 90° to keep semantics consistent.
 */
function normalisedTiltAngle(e: DeviceOrientationEvent) {
  // angle: 0, 90, 180, 270 (or undefined in some browsers)
  const angle = (screen.orientation && typeof screen.orientation.angle === 'number')
    ? screen.orientation.angle
    : (typeof (window as any).orientation === 'number' ? (window as any).orientation : 0)

  const isLandscape = Math.abs((angle ?? 0) % 180) === 90

  // Raw angles
  const beta = e.beta ?? 0   // pitch
  const gamma = e.gamma ?? 0 // roll

  if (!isLandscape) {
    // Portrait -> use pitch directly
    return beta
  }

  // Landscape -> use roll, but normalise direction based on side-rotation
  // On many devices: angle === 90 means rotated clockwise (landscape-primary),
  // which flips "up/down" relative to gamma's sign. We unify by flipping for 90.
  const flip = angle === 90 ? -1 : 1
  return gamma * flip
}

export default function useTilt() {
  const [beta, setBeta] = useState(0)
  const [gamma, setGamma] = useState(0)
  const [alpha, setAlpha] = useState(0)
  const [event, setEvent] = useState<TiltEvent>(null)
  const [permission, setPermission] = useState<Permission>('unknown')
  const listeningRef = useRef(false)
  const lastFire = useRef(0)

  function start() {
    if (listeningRef.current) return
    listeningRef.current = true

    const smooth = { a: 0, b: 0, g: 0 }
    const k = 0.15
    const cooldown = 600
    const upThresh = 25
    const downThresh = -25
    const neutralLow = -10
    const neutralHigh = 10

    const onOrient = (e: DeviceOrientationEvent) => {
      // update smoothed raw angles for debug/visualisation
      smooth.b += k * (((e.beta ?? 0) - smooth.b))
      smooth.g += k * (((e.gamma ?? 0) - smooth.g))
      smooth.a += k * (((e.alpha ?? 0) - smooth.a))
      setBeta(smooth.b); setGamma(smooth.g); setAlpha(smooth.a)

      // Decide on a single normalised axis
      const a = normalisedTiltAngle(e)

      const now = performance.now()
      if (now - lastFire.current < cooldown) return

      // Hysteresis / neutral zone
      if (a <= downThresh) {
        lastFire.current = now
        setEvent('correct')
        return
      }
      if (a >= upThresh) {
        lastFire.current = now
        setEvent('skip')
        return
      }
      if (a > neutralLow && a < neutralHigh) {
        setEvent(null)
      }
    }

    window.addEventListener('deviceorientation', onOrient, true)

    // Optional: keyboard simulator for desktop testing
    if (!('ontouchstart' in window)) {
      const onKey = (ev: KeyboardEvent) => {
        const now = performance.now()
        if (now - lastFire.current < cooldown) return
        if (ev.key === 'ArrowDown') { lastFire.current = now; setEvent('correct') }
        if (ev.key === 'ArrowUp')   { lastFire.current = now; setEvent('skip') }
      }
      window.addEventListener('keydown', onKey)
    }
  }

  async function ensurePermission() {
    const res = await requestMotionPermission()
    setPermission(res)
    return res
  }

  useEffect(() => {
    const reset = () => setEvent(null)
    document.addEventListener('visibilitychange', reset)
    window.addEventListener('pagehide', reset)
    return () => {
      document.removeEventListener('visibilitychange', reset)
      window.removeEventListener('pagehide', reset)
    }
  }, [])

  return { beta, gamma, alpha, event, permission, ensurePermission, start }
}
