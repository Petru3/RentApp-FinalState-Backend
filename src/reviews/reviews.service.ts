import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewRepository } from './review.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from 'src/auth/user.entity';
import { Review } from './review.entity';
import { Rent } from 'src/rents/rent.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewRepository) // Inject ReviewRepository
    private readonly reviewRepository: ReviewRepository,

    @InjectRepository(Rent) // Inject Rent repository from TypeORM
    private readonly rentRepository: Repository<Rent>,
  ) {}

  async getAllReviewsByRentId(rentId: string): Promise<Review[]> {
    return this.reviewRepository.getAllReviewsByRentId(rentId);
  }

  async createReviewByIdRent(
    rentId: string,
    createReviewDto: CreateReviewDto,
    user: User
  ): Promise<Partial<Review>> {
    return this.reviewRepository.createReviewByIdRent(rentId, createReviewDto, user);
  }

  async deleteReviewById(reviewId: string, user: User): Promise<void> {
    // Fetch the review and include the associated rent
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['rent'], // Ensure that the rent entity related to the review is loaded
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }

    // Fetch the associated rent
    const rent = await this.rentRepository.findOne({
      where: { id: review.rentId },
    });

    if (!rent) {
      throw new NotFoundException(`Rent with ID ${review.rentId} not found`);
    }

    // Ensure the authenticated user is the owner of the rent
    if (rent.userId !== user.id) {
      throw new ForbiddenException('You do not have permission to delete this review. Only the owner of the rent can delete reviews.');
    }

    // If everything is valid, proceed to delete the review
    await this.reviewRepository.deleteReviewById(reviewId);
  }
}
