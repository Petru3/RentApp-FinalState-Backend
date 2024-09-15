import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { BookingService } from './booking.service';
import { Booking } from './booking.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
export class BookingController {
    constructor(private readonly bookingService: BookingService) {}

    @Get()
    async getAllBookings(
        @GetUser() user: User
    ): Promise<Booking[]> {
        return this.bookingService.getAllBookings(user);
    }

    @Post('create/:id')
    async createBooking(
        @Param('id') rentId: string,
        @GetUser() user: User,
    ): Promise<Booking> {
        return this.bookingService.createBooking(rentId, user);
    }

    @Post('finish-booking/:id')
    async finishBooking(
     @Param('id') bookingId: string,
     @GetUser() user: User,
     @Body(ValidationPipe) createBooking: CreateBookingDto
    ): Promise<Booking> {
        return this.bookingService.finishBooking(bookingId, user, createBooking);
    }

    @Post('cancel-booking/:id')
    async cancelationBooking(
        @Param('id') bookingId: string,
        @GetUser() user: User
    ): Promise<void> {
        return this.bookingService.cancelationBooking(bookingId, user)
    }
}
