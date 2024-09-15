import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentials } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthReposirory')
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,

        private jwtService: JwtService
    ) {}

    async signUp(
        authCredentials: AuthCredentials
    ): Promise<void> {
        return this.userRepository.signUp(authCredentials);
    }

    async signIn(
        authCredentials: AuthCredentials
    ): Promise<{accessToken: string}> {
        const email = await this.userRepository.ValidateUserPassword(authCredentials);
        
        if(!email) {
            throw new UnauthorizedException ('Invalid credentials')
        }

        const payload: JwtPayload = {email}
        const accessToken = await this.jwtService.sign(payload);

        this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);

        return {accessToken}
    }
}
