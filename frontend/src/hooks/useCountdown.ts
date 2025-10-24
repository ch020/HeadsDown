import {useEffect, useRef, useState} from 'react';

export default function useCountdown(totalMs: number, running: boolean, onDone?: () => void) {
    const [remainingMs, setRemainingMs] = useState(totalMs)
    const ref = useRef<number | null>(null)
    const startRef = useRef<number>(0)
    const carried = useRef<number>(0)

    useEffect(() => {
        if (!running) {
            if (ref.current) cancelAnimationFrame(ref.current)
            ref.current = null
            carried.current = remainingMs
            return
        }
        startRef.current = performance.now()
        const loop = (t: number) => {
            const elapsed = t - startRef.current
            const left = Math.max(0, carried.current - elapsed)
            setRemainingMs(left)
            if (left <= 0) {onDone?.(); return}
            ref.current = requestAnimationFrame(loop)
        }
        ref.current = requestAnimationFrame(loop)
        return () => { if (ref.current) cancelAnimationFrame(ref.current)}
    }, [running])

    useEffect(() => {setRemainingMs(totalMs); carried.current = totalMs}, [totalMs])

    return {remainingMs}
}