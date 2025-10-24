export function shuffleInPlace<T>(arr: T[]) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
}