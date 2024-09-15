import { Module } from '@nestjs/common';
import { RentsModule } from './rents/rents.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/config.typeorm';
import { AuthModule } from './auth/auth.module';
import { ReviewsModule } from './reviews/reviews.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    RentsModule,
    AuthModule,
    ReviewsModule,
    BookingModule
  ],

})
export class AppModule {}
