import { BadRequestException, PipeTransform } from "@nestjs/common";
import { RentStatus } from "../rent-status.enum";


export class RentStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        RentStatus.AVAILABLE,
        RentStatus.RENTED
    ]

    transform(value: any) {
        value = value.toUpperCase();

        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`"${value}" is an invalid status!`);
        }

        return value;
    }

    private isStatusValid(status: string) {
        return this.allowedStatuses.includes(status as RentStatus);
    }
}