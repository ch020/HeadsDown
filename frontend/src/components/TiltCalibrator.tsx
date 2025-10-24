import Button from './Button';
import {requestMotionPermission} from '../hooks/useTilt.ts';

export default function TiltCalibrator({ onReady }: { onReady: () => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Enable Motion Controls</h2>
      <p className="opacity-80">
        We use tilt to mark <strong>correct</strong> (down) or <strong>skip</strong> (up).
        On iOS you must grant permission.
      </p>
      <Button onClick={async () => { await requestMotionPermission(); onReady() }}>
        Allow Motion Access
      </Button>
    </div>
  )
}