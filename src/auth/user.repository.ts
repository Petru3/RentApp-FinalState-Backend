import { ConflictException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentials } from "./dto/auth-credentials.dto";
import * as bcrypt from 'bcrypt';
import { UserRole } from "./user-role.enum";

@Injectable()
export class UserRepository extends Repository<User> {
    private logger = new Logger('UserRepository')
    constructor(private readonly dataSource : DataSource) {
        super(User, dataSource.createEntityManager())
    }

    async signUp(
        authCredentials: AuthCredentials
    ): Promise<void> {
        let {
            email, 
            password,
            role,
        } = authCredentials;

        const user = new User()
        user.email = email;
        user.role = role;
        user.salt = await bcrypt.genSalt()
        user.password = await this.hashPassword(password, user.salt);

        try{
            await this.save(user)
        }catch(error) {
            if (error.code === '23505') {
                throw new ConflictException('Email already exists!');
            } else {
                throw new InternalServerErrorException();
            }
        }

        this.logger.debug(`Sucessfully created an account!`);
    }

    async ValidateUserPassword(
        authCredentials: AuthCredentials
    ): Promise<string> {
        const {
            email, 
            password
        } = authCredentials

        const user = await this.findOne({where: {email}});

        if(user && await user.validatePassword(password)){
            return user.email;
        } else{
            return null;
        }
    }

    async hashPassword(
        password: string,
        salt: string
    ): Promise<string> {
        return bcrypt.hash(password, salt)
    }
}