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

export enum ContactSubject {
  BOOKING_ISSUE = 'Booking Issue',
  CANCELLATION_HELP = 'Cancellation Help',
  PAYMENT_ISSUE = 'Payment Issue',
  OTHER = 'Other',
}

export enum ContactStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: ContactSubject,
    default: ContactSubject.OTHER,
  })
  subject: ContactSubject;

  @Column('text')
  message: string;

  @Column({
    type: 'enum',
    enum: ContactStatus,
    default: ContactStatus.PENDING,
  })
  status: ContactStatus;

  @Column({ nullable: true })
  response: string;

  @Column({ nullable: true })
  respondedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: string;
}
