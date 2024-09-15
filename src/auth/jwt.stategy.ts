import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from "./user.repository";
import * as config from 'config';
import { UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "./jwt-payload.interface";


export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
        })
    }

    async validate(payload: JwtPayload) {
        const { email } = payload
        const user = await this.userRepository.findOne({where: {email} });

        if(!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}