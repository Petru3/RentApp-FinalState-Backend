import { ForbiddenException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rent } from './rent.entity';
import { RentsRepository } from './rents.repository';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { RentStatus } from './rent-status.enum';
import { GetRentsFilterDto } from './dto/get-rents-filtered.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class RentsService {
    private logger = new Logger()
    constructor(
        @InjectRepository(RentsRepository)
        private readonly rentsRepository: RentsRepository
    ) {}

    async getAllRents(
        filterDto: GetRentsFilterDto,
        user: User
    ): Promise<Rent[]> {
        return this.rentsRepository.getAllRents(filterDto, user);
    }

    async getAllRentsForOwners(
        filterDto: GetRentsFilterDto,
        user: User
    ): Promise<Rent[]> {
        return this.rentsRepository.getAllRentsForOwners(filterDto, user);
    }

    async getRentById(
        id: string,
        user: User
    ): Promise<Rent> {
        return this.rentsRepository.getRentById(id, user);
    }

    async createRent(
        createRentDto: CreateRentDto,
        user: User
    ): Promise<Rent> {
        return this.rentsRepository.createRent(createRentDto, user);
    }

    async updateRentById(
        id: string, 
        updateRentDto: UpdateRentDto,
        user: User
    ): Promise<Rent> {
        if (user.role === 'CLIENT') {
            throw new ForbiddenException(`Your role doesn't have permission to update a rent!`);
        }else{
            return this.rentsRepository.updateRentById(id, updateRentDto, user)
        }
    }

    async updateRentStatus(
        id: string, 
        status: RentStatus,
        user: User
    ): Promise<Rent> {
        if (user.role === 'CLIENT') {
            throw new ForbiddenException(`Your role doesn't have permission to update a rent!`);
        }else {
            return this.rentsRepository.updateRentStatus(id, status, user)
        }
    }

    async updateRentDate(
        id: string, 
        dateRent: Date,
        user: User
    ): Promise<Rent> {
        if (user.role === 'CLIENT') {
            throw new ForbiddenException(`Your role doesn't have permission to update a rent!`);
        }else {
            return this.rentsRepository.updateRentDate(id, dateRent, user)
        }

    }

    async deleteRentById(
        id: string,
        user: User
    ): Promise<void> {
        if (user.role === 'CLIENT') {
            throw new ForbiddenException("Your role doesn't have permission to delete a rent!");
        }

        try {
            await this.rentsRepository.deleteRentById(id, user);
        } catch (error) {
            this.logger.error('Error deleting rent:', error);
            throw new HttpException('Failed to delete rent', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
