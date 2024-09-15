import { IsString, IsEmail, Matches, MaxLength, MinLength } from "class-validator";
import { UserRole } from "../user-role.enum";

export class AuthCredentials {

    @IsEmail({}, { message: 'Email must be a valid email address' })
    @MinLength(4)
    @MaxLength(50)
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$)/, 
        {message: 'Password is too weak!'}
    )
    password: string;

    @IsString()
    role: UserRole;
}
