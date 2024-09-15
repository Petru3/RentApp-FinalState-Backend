import { IsIn, IsNotEmpty, IsOptional } from "class-validator";
import { RentStatus } from "../rent-status.enum";

export class GetRentsFilterDto {

    @IsOptional()
    @IsNotEmpty()
    @IsIn([RentStatus.AVAILABLE, RentStatus.RENTED])
    status: RentStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;

    @IsOptional()
    @IsIn(['rentalPrice'])
    sortField: string;

    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortOrder: 'ASC' | 'DESC';
}
