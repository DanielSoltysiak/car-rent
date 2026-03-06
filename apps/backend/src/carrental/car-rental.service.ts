import { Injectable } from '@nestjs/common';
import { Car, CarType } from '@car-rent/shared';
import { CarRentalSystem } from './car-rental-system';
import { Reservation } from './reservation';

export interface CreateReservationDto {
  type: CarType;
  startDate: string;
  endDate: string;
}

@Injectable()
export class CarRentalService {
  private readonly system: CarRentalSystem;

  constructor() {
    const cars: Car[] = [
      new Car('sedan-1', CarType.Sedan),
      new Car('sedan-2', CarType.Sedan),
      new Car('suv-1', CarType.Suv),
      new Car('suv-2', CarType.Suv),
      new Car('van-1', CarType.Van),
    ];

    this.system = new CarRentalSystem(cars);
  }

  reserve(dto: CreateReservationDto): Reservation | null {
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    return this.system.reserve(dto.type, start, end);
  }
}

