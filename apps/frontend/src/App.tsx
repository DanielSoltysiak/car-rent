import { FormEvent, useState } from 'react';

type CarType = 'Sedan' | 'SUV' | 'Van';

interface ReservationResponse {
  id: string;
  carId: string;
  carType: CarType;
  startDate: string;
  endDate: string;
}

function App() {
  const [type, setType] = useState<CarType>('Sedan');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<ReservationResponse | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setReservation(null);

    if (!startDate || !endDate) {
      setError('Wybierz datę rozpoczęcia i zakończenia.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/car-rental/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Nie udało się utworzyć rezerwacji.');
      }

      const data: ReservationResponse = await res.json();
      setReservation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił nieznany błąd.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-semibold mb-1">Rezerwacja samochodu</h1>
        <p className="text-sm text-slate-400 mb-6">
          Wybierz typ samochodu oraz zakres dat. System sprawdzi dostępność i utworzy rezerwację.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="type">
              Typ samochodu
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as CarType)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="startDate">
                Data rozpoczęcia
              </label>
              <input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="endDate">
                Data zakończenia
              </label>
              <input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          {reservation && (
            <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-3 text-sm text-emerald-100 space-y-1">
              <p className="font-semibold">Rezerwacja utworzona!</p>
              <p>ID rezerwacji: {reservation.id}</p>
              <p>
                Auto: {reservation.carType} ({reservation.carId})
              </p>
              <p>
                Od: {new Date(reservation.startDate).toLocaleString()} <br />
                Do: {new Date(reservation.endDate).toLocaleString()}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-slate-950 shadow-md hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Rezerwuję...' : 'Zarezerwuj samochód'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
