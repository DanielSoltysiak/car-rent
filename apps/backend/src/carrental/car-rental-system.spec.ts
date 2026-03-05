import { Car, CarType } from '@car-rent/shared';
import { CarRentalSystem } from './car-rental-system';

const createDate = (iso: string): Date => new Date(iso);

describe('CarRentalSystem', () => {
  const baseDate = createDate('2025-01-01T10:00:00.000Z');

  const createCars = (): Car[] => [
    new Car('sedan-1', CarType.Sedan),
    new Car('sedan-2', CarType.Sedan),
    new Car('suv-1', CarType.Suv),
  ];

  it('throws when created with no cars', () => {
    expect(() => new CarRentalSystem([])).toThrow('At least one car is required');
  });

  it('returns number of available cars for given type and period', () => {
    const system = new CarRentalSystem(createCars());

    const availableSedans = system.getAvailableCarCount(
      CarType.Sedan,
      baseDate,
      createDate('2025-01-03T10:00:00.000Z'),
    );

    expect(availableSedans).toBe(2);
  });

  it('reserves a car when at least one is free', () => {
    const system = new CarRentalSystem(createCars());

    const reservation = system.reserve(
      CarType.Sedan,
      baseDate,
      createDate('2025-01-03T10:00:00.000Z'),
    );

    expect(reservation.id).toBeDefined();
    expect(reservation.car.type).toBe(CarType.Sedan);
    expect(reservation.startDate).toEqual(baseDate);
  });

  it('does not allow overlapping reservations for the same car beyond capacity', () => {
    const system = new CarRentalSystem([
      new Car('sedan-1', CarType.Sedan),
      new Car('sedan-2', CarType.Sedan),
    ]);

    // Dwie rezerwacje mieszczą się w dwóch autach
    system.reserve(
      CarType.Sedan,
      baseDate,
      createDate('2025-01-03T10:00:00.000Z'),
    );
    system.reserve(
      CarType.Sedan,
      baseDate,
      createDate('2025-01-03T10:00:00.000Z'),
    );

    // Trzecia rezerwacja na ten sam okres powinna się nie udać
    expect(() =>
      system.reserve(
        CarType.Sedan,
        baseDate,
        createDate('2025-01-03T10:00:00.000Z'),
      ),
    ).toThrow('No available Sedan cars for the requested period');
  });

  it('allows back-to-back reservations without overlap', () => {
    const system = new CarRentalSystem([new Car('sedan-1', CarType.Sedan)]);

    const firstEnd = createDate('2025-01-03T10:00:00.000Z');

    system.reserve(CarType.Sedan, baseDate, firstEnd);

    // Nowa rezerwacja zaczyna się dokładnie w momencie zakończenia poprzedniej
    expect(() =>
      system.reserve(
        CarType.Sedan,
        firstEnd,
        createDate('2025-01-05T10:00:00.000Z'),
      ),
    ).not.toThrow();
  });

  it('rejects reservation when end date is before or equal to start date', () => {
    const system = new CarRentalSystem([new Car('sedan-1', CarType.Sedan)]);

    expect(() =>
      system.reserve(
        CarType.Sedan,
        baseDate,
        createDate('2024-12-31T10:00:00.000Z'),
      ),
    ).toThrow('Reservation end date must be after start date');

    expect(() =>
      system.reserve(CarType.Sedan, baseDate, baseDate),
    ).toThrow('Reservation end date must be after start date');
  });
});

