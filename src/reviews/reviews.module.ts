import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { ReviewRepository } from './review.repository';
import { Review } from './review.entity';
import { Rent } from '../rents/rent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Rent])], // Register entities
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewRepository],
  exports: [ReviewsService],
})
export class ReviewsModule {}
