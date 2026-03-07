import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Property } from './property.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  checkIn: Date;

  @Column({ type: 'date' })
  checkOut: Date;

  @Column()
  guests: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  serviceFee: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ nullable: true })
  paymentTransactionId: string;

  @Column({ default: false })
  isPaid: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Property, (property) => property.bookings)
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Column()
  propertyId: string;
}
