import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, Index } from "typeorm";
import { RentStatus } from "./rent-status.enum";
import { Review } from "src/reviews/review.entity";
import { User } from "src/auth/user.entity";

@Entity()
@Unique(['licencePlate'])
export class Rent {
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

  @Column()
  imageRent: string;

  // OneToMany relationship with Review
  @OneToMany(
    type => Review,
    review => review.rent,
    { eager: false } // Adjust based on your needs
  )
  reviews: Review[];

  // ManyToOne relationship with User
  @ManyToOne(
    type => User,
    user => user.rents,
    { eager: false, nullable: false } // Lazy-loaded relationship, ensure `nullable: false` if `user` is always required
  )
  user: User;

  @Column('uuid')
  @Index() // Add an index for performance
  userId: string;
}
