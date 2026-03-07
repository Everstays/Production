import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum NotificationType {
  GUIDE_BOOKING_CONFIRMED = 'guide_booking_confirmed',
  GUIDE_BOOKING_CANCELLED = 'guide_booking_cancelled',
  CAB_DRIVER_ASSIGNED = 'cab_driver_assigned',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column('text')
  message: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
