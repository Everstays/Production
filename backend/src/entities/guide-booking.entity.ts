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
import { Guide } from './guide.entity';

export enum GuideBookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('guide_bookings')
export class GuideBooking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  bookingDate: string;

  @Column({ default: 1 })
  numberOfDays: number;

  @Column('text', { nullable: true })
  message: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: GuideBookingStatus,
    default: GuideBookingStatus.PENDING,
  })
  status: GuideBookingStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Guide)
  @JoinColumn({ name: 'guideId' })
  guide: Guide;

  @Column()
  guideId: string;
}
