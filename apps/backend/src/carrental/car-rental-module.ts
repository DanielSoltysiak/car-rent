import { Module } from '@nestjs/common';
import { CarRentalController } from './car-rental.controller';
import { CarRentalService } from './car-rental.service';

@Module({
    imports: [],
    controllers: [CarRentalController],
    providers: [CarRentalService],
})
export class CarRentalModule { }
