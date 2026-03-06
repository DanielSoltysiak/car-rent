import { CarType } from '@car-rent/shared';

type Props = {
    type: CarType;
    onChange: (type: CarType) => void;
}

export const CarTypeSelect = ({ type, onChange }: Props) => {
    return (
        <div>
            <label className="block text-sm font-medium mb-1" htmlFor="type">
                Typ samochodu
            </label>
            <select
                id="type"
                value={type}
                onChange={(e) => onChange(e.target.value as CarType)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
                {Object.values(CarType).map((value) => (
                    <option key={value} value={value}>{value}</option>
                ))}
            </select>
        </div>
    );
};