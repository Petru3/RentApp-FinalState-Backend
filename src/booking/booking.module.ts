import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { BookingRepository } from './booking.repository';
import { User } from 'src/auth/user.entity';
import { Rent } from 'src/rents/rent.entity';
import { RentsRepository } from 'src/rents/rents.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking])
  ],
  controllers: [BookingController],
  providers: [
    BookingService,
    BookingRepository,
    RentsRepository
  ],
  exports: [
    BookingService
  ]
})
export class BookingModule {}
