import { Type } from "class-transformer";
import { IsDate } from "class-validator";


export class CreateBookingDto {

    @Type(() => Date) // Use class-transformer to convert to Date
    @IsDate()
    dateRent: Date;
}