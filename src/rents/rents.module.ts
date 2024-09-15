import { Module } from '@nestjs/common';
import { RentsController } from './rents.controller';
import { RentsService } from './rents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rent } from './rent.entity';
import { RentsRepository } from './rents.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rent])
  ],
  controllers: [
    RentsController
  ],
  providers: [
    RentsService,
    RentsRepository
  ],
  exports: [
    RentsService
  ]
})
export class RentsModule {}
