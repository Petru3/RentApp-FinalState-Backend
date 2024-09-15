import { BadRequestException, PipeTransform } from "@nestjs/common";
import { UserRole } from "../user-role.enum";


export class UserRoleValidationPipe implements PipeTransform {
    readonly allowedStatus = [
        UserRole.CLIENT,
        UserRole.OWNER
    ]

    transform(value: any) {
        value = value.toUpperCase()

        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`"${value}" is an invalid status!`);
        }

        return value;
    }

    private isStatusValid(role: string) {
        return this.allowedStatus.includes(role as UserRole);
    }
}