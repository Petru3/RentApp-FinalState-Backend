import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Index } from "typeorm";
import { User } from "src/auth/user.entity";
import { Rent } from "src/rents/rent.entity";

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  comment: string;

  @Column()
  name: string;

  // Relație ManyToOne cu User
  @ManyToOne(
    type => User,
    user => user.reviews,
    { eager: false }
  )
  user: User;

  @Index() // Adaugă un index pentru performanță
  @Column('uuid')
  userId: string;

  // Relație ManyToOne cu Rent
  @ManyToOne(
    type => Rent,
    rent => rent.reviews,
    { eager: false }
  )
  rent: Rent;

  @Index() // Adaugă un index pentru performanță
  @Column('uuid')
  rentId: string;
}
