import { User } from "src/auth/user.entity";
import { RentStatus } from "src/rents/rent-status.enum";
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity()
@Unique(['licencePlate'])
export class Booking {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    make: string;

    @Column()
    year: number;

    @Column()
    licencePlate: string;

    @Column({
        type: 'enum',
        enum: RentStatus,
        default: RentStatus.AVAILABLE,
    })
    status: RentStatus;

    @Column({ type: 'date' })
    dateRent: Date;

    @Column('decimal')
    rentalPrice: number;

    @ManyToOne(() => User, user => user.bookings)
    user: User;

    @Column()
    userId: string;

    @Column()
    rentId: string;
}

