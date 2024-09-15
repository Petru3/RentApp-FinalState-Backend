import { IsDate, IsInt, IsNotEmpty, IsString, IsNumber, MinLength } from "class-validator";
import { Type } from "class-transformer";

export class CreateRentDto {

    @IsNotEmpty()
    @IsString()
    make: string;

    @IsNotEmpty()
    @IsInt()
    year: number;

    @IsNotEmpty()
    @IsString()
    licencePlate: string;

    @Type(() => Date) // Use class-transformer to convert to Date
    @IsDate()
    dateRent: Date;

    @IsNotEmpty()
    @IsNumber() // Change to validate numbers
    rentalPrice: number;

    @IsNotEmpty()
    @IsString()
    imageRent: string;
}
