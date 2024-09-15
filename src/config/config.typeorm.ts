import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from 'config'
import { User } from "src/auth/user.entity";
import { Booking } from "src/booking/booking.entity";
import { Rent } from "src/rents/rent.entity";
import { Review } from "src/reviews/review.entity";

const dbConfig = config.get('db')

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: dbConfig.type,
    host: process.env.RDS_HOST || dbConfig.host,
    port: process.env.PORT || dbConfig.port,
    username: process.env.RDS_USERNAME || dbConfig.username,
    password: process.env.RDS_PASSWORD || dbConfig.password,
    database: process.env.RDS_DATABASE || dbConfig.database,
    entities: [Rent, User, Review, Booking],
    synchronize: true
}