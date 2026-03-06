import { randomUUID } from 'crypto';
import { Car, CarType } from '@car-rent/shared';
import { Reservation } from './reservation';

export class CarRentalSystem {
  private readonly carsByType: Map<CarType, Car[]> = new Map();
  private readonly reservationsByCarId: Map<string, Reservation[]> = new Map();

  constructor(cars: Car[]) {
    if (cars.length === 0) {
      throw new Error('At least one car is required');
    }

    for (const car of cars) {
      const carsOfType = this.carsByType.get(car.type) ?? [];
      carsOfType.push(car);
      this.carsByType.set(car.type, carsOfType);

      this.reservationsByCarId.set(car.id, []);
    }
  }

  getAvailableCarCount(type: CarType, startDate: Date, endDate: Date): number {
    const cars = this.carsByType.get(type) ?? [];

    return cars.filter((car) => this.isCarAvailable(car, startDate, endDate)).length;
  }

  reserve(type: CarType, startDate: Date, endDate: Date): Reservation | null {
    if (endDate <= startDate) {
      throw new Error('Reservation end date must be after start date');
    }

    const cars = this.carsByType.get(type) ?? [];

    if (cars.length === 0) {
      return null;
    }

    for (const car of cars) {
      if (this.isCarAvailable(car, startDate, endDate)) {
        const reservation = new Reservation(randomUUID(), car, startDate, endDate);
        const carReservations = this.reservationsByCarId.get(car.id);

        if (!carReservations) {
          this.reservationsByCarId.set(car.id, [reservation]);
        } else {
          carReservations.push(reservation);
        }

        return reservation;
      }
    }

    return null;
  }

  private isCarAvailable(car: Car, startDate: Date, endDate: Date): boolean {
    const reservations = this.reservationsByCarId.get(car.id) ?? [];

    return reservations.every(
      (reservation) =>
        !this.doRangesOverlap(
          startDate,
          endDate,
          reservation.startDate,
          reservation.endDate,
        ),
    );
  }

  private doRangesOverlap(
    startA: Date,
    endA: Date,
    startB: Date,
    endB: Date,
  ): boolean {
    return startA < endB && startB < endA;
  }
}

