import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserRole } from "./user-role.enum";
import * as bcrypt from 'bcrypt';
import { Review } from "src/reviews/review.entity";
import { Rent } from "src/rents/rent.entity"; // Adjust the import path as needed
import { Booking } from "src/booking/booking.entity";

@Entity()
@Unique(['email'])
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CLIENT
    })
    role: UserRole;

    @Column()
    salt: string;

    @OneToMany(
        type => Review,
        review => review.user,
        { eager: true } // Consider if eager loading is necessary
    )
    reviews: Review[];

    @OneToMany(
        type => Rent,
        rent => rent.user,
        { eager: true } // Consider if eager loading is necessary
    )
    rents: Rent[];

    @OneToMany(() => Booking, booking => booking.user)
    bookings: Booking[];

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}
