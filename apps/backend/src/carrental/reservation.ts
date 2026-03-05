import { Car } from '../shared/car';

export class Reservation {
  constructor(
    public readonly id: string,
    public readonly car: Car,
    public readonly startDate: Date,
    public readonly endDate: Date,
  ) {
    if (endDate <= startDate) {
      throw new Error('Reservation end date must be after start date');
    }
  }
}

