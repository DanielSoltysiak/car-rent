import { randomUUID } from 'crypto';
import { Car, CarType } from '../shared/car';
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

  getAvailableCarCount(type: CarType, startDate: Date, days: number): number {
    const cars = this.carsByType.get(type) ?? [];

    return cars.filter((car) => this.isCarAvailable(car, startDate, days)).length;
  }

  reserve(type: CarType, startDate: Date, days: number): Reservation {
    if (days <= 0) {
      throw new Error('Number of days must be positive');
    }

    const cars = this.carsByType.get(type) ?? [];

    if (cars.length === 0) {
      throw new Error(`No cars of type ${type} in the fleet`);
    }

    for (const car of cars) {
      if (this.isCarAvailable(car, startDate, days)) {
        const endDate = this.calculateEndDate(startDate, days);
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

    throw new Error(`No available ${type} cars for the requested period`);
  }

  private isCarAvailable(car: Car, startDate: Date, days: number): boolean {
    const reservations = this.reservationsByCarId.get(car.id) ?? [];
    const requestedEndDate = this.calculateEndDate(startDate, days);

    return reservations.every(
      (reservation) =>
        !this.doRangesOverlap(
          startDate,
          requestedEndDate,
          reservation.startDate,
          reservation.endDate,
        ),
    );
  }

  private calculateEndDate(startDate: Date, days: number): Date {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);

    return endDate;
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

