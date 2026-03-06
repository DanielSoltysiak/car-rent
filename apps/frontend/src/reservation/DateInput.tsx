type Props = { label: string; value: string; onChange: (value: string) => void }

export const DateInput = ({ label, value, onChange }: Props) => {
    return (
        <div>
            <label className="block text-sm font-medium mb-1" htmlFor="startDate">
                {label}
            </label>
            <input
                id="startDate"
                type="datetime-local"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
        </div>
    )

}