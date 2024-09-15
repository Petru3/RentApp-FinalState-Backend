import { Controller, Get, Post, Delete, Param, Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './review.entity';
import { User } from 'src/auth/user.entity';

@Controller('reviews')
@UseGuards(AuthGuard('jwt'))
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('/rent/:id')
  async getAllReviewsByRentId(@Param('id') rentId: string): Promise<Review[]> {
    return this.reviewsService.getAllReviewsByRentId(rentId);
  }

  @Post('/rent/:id')
  async createReviewByIdRent(
    @Param('id') rentId: string,
    @Body(ValidationPipe) createReviewDto: CreateReviewDto,
    @GetUser() user: User
  ): Promise<Partial<Review>> {
    return this.reviewsService.createReviewByIdRent(rentId, createReviewDto, user);
  }

  @Delete('/rent/:id') // ':id' represents the reviewId
  async deleteReviewById(
    @Param('id') reviewId: string, // Expect reviewId in the route parameter
    @GetUser() user: User // Get the authenticated user
  ): Promise<void> {
    return this.reviewsService.deleteReviewById(reviewId, user);
  }
}
