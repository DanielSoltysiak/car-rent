import { type SubmitEvent, useState } from 'react';
import { CarTypeSelect, DateInput } from './reservation';
import { CarType } from '@car-rent/shared';

interface ReservationSuccessResponse {
  success: true;
  id: string;
  carId: string;
  carType: CarType;
  startDate: string;
  endDate: string;
}

interface ReservationFailureResponse {
  success: false;
  reason: 'NO_AVAILABLE_CAR';
}

type ReservationResponse = ReservationSuccessResponse | ReservationFailureResponse;

const fetchReservation = async (type: CarType, startDate: string, endDate: string) => {
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
    const text = await res.text().catch(() => '');
    throw new Error(text || 'Nie udało się utworzyć rezerwacji.');
  }

  return (await res.json()) as ReservationResponse;
};

function App() {
  const [type, setType] = useState<CarType>(CarType.Sedan);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<ReservationSuccessResponse | null>(null);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setReservation(null);

    if (!startDate || !endDate) {
      setError('Wybierz datę rozpoczęcia i zakończenia.');
      return;
    }

    setLoading(true);
    try {
      const data = await fetchReservation(type, startDate, endDate);

      if (!data.success) {
        setError('Brak dostępnych samochodów dla wybranego typu i terminu.');
        return;
      }

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
          <CarTypeSelect type={type} onChange={setType} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateInput label="Data rozpoczęcia" value={startDate} onChange={setStartDate} />

            <DateInput label="Data zakończenia" value={endDate} onChange={setEndDate} />
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
