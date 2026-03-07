import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Property } from './property.entity';
import { Booking } from './booking.entity';
import { Review } from './review.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column('text', { array: true, default: [] })
  wishlist: string[];

  @Column({ nullable: true })
  phone: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  resetToken: string;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiry: Date;

  @Column({ nullable: true })
  bankAccountNumber: string;

  @Column({ nullable: true })
  ifscCode: string;

  @Column({ nullable: true })
  accountHolderName: string;

  @Column({ nullable: true })
  panNumber: string;

  @Column({ nullable: true })
  gstNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Property, (property) => property.host)
  properties: Property[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
