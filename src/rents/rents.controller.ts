import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { RentsService } from './rents.service';
import { Rent } from './rent.entity';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { RentStatus } from './rent-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { RentStatusValidationPipe } from './pipes/rent-status.validation.pipe';
import { GetRentsFilterDto } from './dto/get-rents-filtered.dto';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('rents')
@UseGuards(AuthGuard('jwt'))
export class RentsController {
    constructor(private readonly rentsService: RentsService) {}

    @Get()
    async getAllRents(
        @Query(ValidationPipe) filterDto: GetRentsFilterDto,
        @GetUser() user: User
    ): Promise<Rent[]> {
        return this.rentsService.getAllRents(filterDto, user);
    }

    @Get('/owners')
    async getAllRentsForOwners(
        @Query(ValidationPipe) filterDto: GetRentsFilterDto,
        @GetUser() user: User
    ): Promise<Rent[]> {
        return this.rentsService.getAllRentsForOwners(filterDto, user);
    }

    @Get(':id')
    async getRentById(
        @Param('id') id: string,
        @GetUser() user: User
    ): Promise<Rent> {
        return this.rentsService.getRentById(id, user);
    }

    @Post()
    async createRent(
        @Body() createRentDto: CreateRentDto,
        @GetUser() user: User
    ): Promise<Rent> {
        return this.rentsService.createRent(createRentDto, user);
    }

    @Patch('/update/:id')
    async updateRentById(
        @Param('id') id: string,
        @Body() updateRentDto: UpdateRentDto,
        @Body('status', RentStatusValidationPipe) status: RentStatus,
        @GetUser() user: User
    ): Promise<Rent> {
        return this.rentsService.updateRentById(id, updateRentDto, user);
    }

    @Patch('/update/status/:id')
    async updateRentStatus(
        @Param('id') id: string,
        @Body('status', RentStatusValidationPipe) status: RentStatus,
        @GetUser() user: User
    ): Promise<Rent> {
        return this.rentsService.updateRentStatus(id, status, user);
    }

    @Patch('/update/date/:id')
    async updateRentDate(
        @Param('id') id: string,
        @Body('dateRent') dateRent: Date,
        @GetUser() user: User
    ): Promise<Rent> {
        return this.rentsService.updateRentDate(id, dateRent, user);
    }

    @Delete(':id')
    async deleteRentById(
        @Param('id') id: string,
        @GetUser() user: User
    ): Promise<void> {
        await this.rentsService.deleteRentById(id, user);
    }
}
