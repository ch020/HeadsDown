import confetti from 'canvas-confetti'

export function burstSmall(x = 0.5, y = 0.5) {
  confetti({ particleCount: 30, spread: 60, startVelocity: 45, scalar: 0.9, origin: { x, y } })
}

export function burstWin() {
  const end = Date.now() + 1200
  ;(function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    })
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}
