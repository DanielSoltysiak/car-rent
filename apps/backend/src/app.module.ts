import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarRentalModule } from './carrental/car-rental-module'

@Module({
  imports: [CarRentalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
