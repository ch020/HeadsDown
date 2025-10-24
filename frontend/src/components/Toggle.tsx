type Props = {checked: boolean; onChange: (v: boolean) => void, label: string};
export default function Toggle({checked, onChange, label}: Props) {
    return (
        <label className="flex items-center gap-3">
            <span>{label}</span>
            <input
                type="checkbox"
                checked={checked}
                onChange={e => onChange(e.target.checked)}
                className="w-5 h-5 accent-brand-500"
            />
        </label>
    )
}