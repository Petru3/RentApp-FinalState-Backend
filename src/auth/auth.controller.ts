import { Body, Controller, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentials } from './dto/auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { UserRoleValidationPipe } from './pipes/user-role.validation.pipe';
import { UserRole } from './user-role.enum';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('/signup')
    signUp(
        @Body(ValidationPipe) authCredentials: AuthCredentials,
        @Body('role', UserRoleValidationPipe) role: UserRole
    ): Promise<void> {
        return this.authService.signUp(authCredentials);
    }

    @Post('/signin')
    signIn(
        @Body(ValidationPipe) AuthCredentials: AuthCredentials
    ): Promise<{accessToken: string}> {
        return this.authService.signIn(AuthCredentials);
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    test(
        @GetUser() user: User
    ) {
        console.log(user);
    }
}
