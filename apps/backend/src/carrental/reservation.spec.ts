import { Car, CarType } from '@car-rent/shared';
import { Reservation } from './reservation';

describe('Reservation', () => {
  const car = new Car('car-1', CarType.Sedan);
  const startDate = new Date('2025-01-01T10:00:00.000Z');
  const endDate = new Date('2025-01-05T10:00:00.000Z');

  it('creates reservation with valid dates', () => {
    const reservation = new Reservation('res-1', car, startDate, endDate);

    expect(reservation.id).toBe('res-1');
    expect(reservation.car).toBe(car);
    expect(reservation.startDate).toEqual(startDate);
    expect(reservation.endDate).toEqual(endDate);
  });

  it('throws when end date is before start date', () => {
    expect(
      () =>
        new Reservation(
          'res-1',
          car,
          startDate,
          new Date('2024-12-31T10:00:00.000Z'),
        ),
    ).toThrow('Reservation end date must be after start date');
  });

  it('throws when end date is equal to start date', () => {
    expect(() => new Reservation('res-1', car, startDate, startDate)).toThrow(
      'Reservation end date must be after start date',
    );
  });
});

