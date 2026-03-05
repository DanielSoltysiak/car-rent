import { Body, Controller, Post } from '@nestjs/common';
import * as carRentalService from './car-rental.service';

@Controller('car-rental')
export class CarRentalController {
  constructor(private readonly carRentalService: carRentalService.CarRentalService) { }

  @Post('reservations')
  createReservation(@Body() body: carRentalService.CreateReservationDto) {
    const reservation = this.carRentalService.reserve(body);

    return {
      id: reservation.id,
      carId: reservation.car.id,
      carType: reservation.car.type,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
    };
  }
}

