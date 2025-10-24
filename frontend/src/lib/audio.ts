const sounds = new Map<string, HTMLAudioElement>()
function get(name: 'correct' | 'skip') {
    if (!sounds.has(name)) {
        const a = new Audio(name === 'correct' ? '/src/assets/correct.mp3' : '/src/assets/skip.mp3')
        a.preload = 'auto'
        sounds.set(name, a)
    }
    return sounds.get(name)!
}
export const playCorrect = () => get('correct').play().catch(() => {})
export const playSkip = () => get('skip').play().catch(() => {})