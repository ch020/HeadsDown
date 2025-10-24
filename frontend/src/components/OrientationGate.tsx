import {useEffect, useState} from "react";

export default function OrientationGate({ children }: {children: React.ReactNode}) {
    const [landscape, setLandscape] = useState<boolean>(() => window.innerWidth > window.innerHeight)

    useEffect(() => {
        const onResize = () => setLandscape(window.innerWidth > window.innerHeight)
        window.addEventListener('resize', onResize)
        screen.orientation?.addEventListener?.('change', onResize as any)
        return () => {
            window.removeEventListener('resize', onResize)
            screen.orientation?.removeEventListener?.('change', onResize as any)
        }
    })

    if (!landscape) {
        return (
            <div className="h-full grid place-items-center">
                <div className="text-center">
                    <div className="text-2xl font-bold mb-2">Rotate your phone</div>
                    <div className="opacity-70">This game is best in landscape.</div>
                </div>
            </div>
        )
    }
    return <>{children}</>
}