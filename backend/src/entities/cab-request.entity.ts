import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Property } from './property.entity';
import { Cab } from './cab.entity';

export enum CabRequestStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
}

@Entity('cab_requests')
export class CabRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pickupLocation: string;

  @Column()
  dropLocation: string;

  @Column({ type: 'date' })
  travelDate: string;

  @Column() // e.g. "10:00", "14:30"
  travelTime: string;

  @Column({ default: '5 or 7' })
  seatsPreference: string;

  @Column({ type: 'int', default: 1 })
  numberOfPeople: number;

  @Column()
  guestName: string;

  @Column()
  guestPhone: string;

  @Column({ nullable: true })
  guestEmail: string | null;

  @Column({ type: 'text', nullable: true })
  specialRequests: string | null;

  @Column({
    type: 'enum',
    enum: CabRequestStatus,
    default: CabRequestStatus.PENDING,
  })
  status: CabRequestStatus;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @Column({ nullable: true })
  userId: string | null;

  @ManyToOne(() => Property)
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Column()
  propertyId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'hostId' })
  host: User;

  @Column()
  hostId: string;

  @ManyToOne(() => Cab, { nullable: true })
  @JoinColumn({ name: 'assignedCabId' })
  assignedCab: Cab | null;

  @Column({ nullable: true })
  assignedCabId: string | null;
}
