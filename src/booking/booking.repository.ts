import { ForbiddenException, Injectable, NotFoundException, HttpException, HttpStatus } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Booking } from "./booking.entity";
import { User } from "src/auth/user.entity";
import { Rent } from "src/rents/rent.entity";
import { RentStatus } from "src/rents/rent-status.enum";
import { RentsRepository } from "src/rents/rents.repository"; // Import the RentsRepository
import { CreateBookingDto } from "./dto/create-booking.dto";

@Injectable()
export class BookingRepository extends Repository<Booking> {
    constructor(
        private readonly dataSource: DataSource,
        private readonly rentsRepository: RentsRepository // Inject the RentsRepository
    ) {
        super(Booking, dataSource.createEntityManager());
    }
    
    async getAllBookings(user: User): Promise<Booking[]> {
        // Fetch all bookings for the user
        const bookings = await this.createQueryBuilder('booking')
            .leftJoinAndSelect('booking.user', 'user')
            .where('user.id = :id', { id: user.id })
            .getMany();
    
        // Remove the `user` property from each booking
        bookings.forEach(booking => {
            delete booking.user;
        });
    
        return bookings;
    }
    
    async createBooking(
        rentId: string,
        user: User,
    ): Promise<Booking> {
        const rent = await this.dataSource.getRepository(Rent).findOne({
            where: { id: rentId },
            relations: ['user'],
        });
    
        if (!rent) {
            throw new NotFoundException(`Rent with ID ${rentId} not found`);
        }

        if (rent.status === RentStatus.RENTED) {
            throw new NotFoundException(`Rent with ID ${rentId} has a status: "${rent.status}"`);
        }
    
        if (rent.userId === user.id) {
            throw new ForbiddenException('You cannot reserve your own rent.');
        }

        const existingBooking = await this.findOne({ where: { licencePlate: rent.licencePlate } });
        if (existingBooking) {
            throw new HttpException('Duplicate license plate', HttpStatus.BAD_REQUEST);
        }
    
        const newBooking = new Booking();
        newBooking.make = rent.make;
        newBooking.year = rent.year;
        newBooking.licencePlate = rent.licencePlate;
        newBooking.dateRent = rent.dateRent;
        newBooking.status = rent.status;
        newBooking.rentalPrice = rent.rentalPrice;
        newBooking.user = user;
        newBooking.userId = user.id;
        newBooking.rentId = rentId;
    
        await this.save(newBooking);

        delete newBooking.user;
    
        return newBooking;
    }

    async finishBooking(
        bookingId: string, 
        user: User,
        createBooking: CreateBookingDto
    ): Promise<Booking> {
        const { dateRent } = createBooking;
    
        // Fetch the booking by ID
        const booking = await this.findOne({ where: { id: bookingId } });
    
        if (!booking) {
            throw new NotFoundException(`Booking with ID ${bookingId} not found`);
        }
    
        // Fetch the related rent using the RentsRepository
        const rent = await this.rentsRepository.findOne({ where: { id: booking.rentId } });
    
        if (rent.status === RentStatus.RENTED) {
            throw new ForbiddenException('This car is already RENTED!');
        }
    
        // Ensure the user is authorized to finish this booking
        if (booking.userId !== user.id) {
            throw new ForbiddenException('You are not authorized to finish this booking.');
        }
    
        // Update the rent date and status using RentsRepository
        await this.rentsRepository.updateRentDate(booking.rentId, dateRent, user);
        await this.rentsRepository.updateRentStatus(booking.rentId, RentStatus.RENTED, user);
    
        // Update the booking's rent date
        booking.dateRent = dateRent;
        booking.status = RentStatus.RENTED;
    
        // Save the updated booking entity
        await this.save(booking);
    
        return booking;
    }

    async cancelationBooking(bookingId: string, user: User): Promise<void> {
        // Fetch the booking details
        const booking = await this.findOne({ where: { id: bookingId } });
    
        if (!booking) {
            throw new NotFoundException(`Booking with ID ${bookingId} not found`);
        }
    
        // Ensure the user is authorized to cancel this booking
        if (booking.userId !== user.id) {
            throw new ForbiddenException('You are not authorized to cancel this booking.');
        }
    
        // Use the rentId from the booking to update the rent status to 'AVAILABLE'
        await this.rentsRepository.updateRentStatus(booking.rentId, RentStatus.AVAILABLE, user);
    
        const deleteResult = await this.delete(bookingId);
    
        if (deleteResult.affected === 0) {
            throw new NotFoundException(`Failed to delete booking with ID ${bookingId}`);
        }
    }
}
