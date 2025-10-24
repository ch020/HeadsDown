import useCountdown from '../hooks/useCountdown';

type Props = {ms: number, running: boolean, onDone?: () => void}
export default function Timer({ms, running, onDone}: Props) {
    const {remainingMs} = useCountdown(ms, running, onDone)
    const secs = Math.ceil(remainingMs / 1000)
    return (
        <div className="text-4xl font-bold tabular-nums">
      {secs}s
      <div className="h-2 mt-2 bg-white/10 rounded">
        <div
          className="h-2 bg-brand-500 rounded"
          style={{ width: `${(remainingMs / ms) * 100}%` }}
        />
      </div>
    </div>
    )
}