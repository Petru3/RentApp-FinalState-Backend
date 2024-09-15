import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingRepository } from './booking.repository';
import { Booking } from './booking.entity';
import { User } from 'src/auth/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
    constructor(
        @InjectRepository(BookingRepository)
        private readonly bookingRepository: BookingRepository
    ) {}

    async getAllBookings(
        user: User
    ): Promise<Booking[]> {
        return this.bookingRepository.getAllBookings(user);
    }

    async createBooking(
        rentId: string,
        user: User,
    ): Promise<Booking> {
        return this.bookingRepository.createBooking(rentId, user);
    }

    async finishBooking(
        bookingId: string,
        user: User,
        createBooking: CreateBookingDto
    ): Promise<Booking> {
        return this.bookingRepository.finishBooking(bookingId, user, createBooking);
    }

    async cancelationBooking(
        bookingId: string,
        user: User
    ): Promise<void> {
        return this.bookingRepository.cancelationBooking(bookingId, user);
    }
}
