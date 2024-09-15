import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as config from 'config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtStrategy } from './jwt.stategy'; // Corectare typo
import { UserRepository } from './user.repository';

const jwtConfig = config.get('jwt');

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn
      }
    }),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UserRepository
  ],
  exports: [
    AuthService,
    JwtStrategy,
    PassportModule
  ]
})
export class AuthModule {}
