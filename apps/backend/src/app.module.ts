import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarRentalController } from './carrental/car-rental.controller';
import { CarRentalService } from './carrental/car-rental.service';

@Module({
  imports: [],
  controllers: [AppController, CarRentalController],
  providers: [AppService, CarRentalService],
})
export class AppModule {}
