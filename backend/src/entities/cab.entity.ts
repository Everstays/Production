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

export enum CabType {
  SEDAN = 'Sedan',
  SUV = 'SUV',
  HATCHBACK = 'Hatchback',
  VAN = 'Van',
  LUXURY = 'Luxury',
}

export enum CabSeats {
  FOUR = 4,
  FIVE = 5,
  SEVEN = 7,
  EIGHT = 8,
}

@Entity('cabs')
export class Cab {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vehicleName: string;

  @Column()
  vehicleNumber: string;

  @Column({ type: 'enum', enum: CabType })
  vehicleType: CabType;

  @Column({ type: 'enum', enum: CabSeats })
  seats: CabSeats;

  @Column('text', { array: true, default: [] })
  images: string[];

  @Column('text', { array: true, default: [] })
  amenities: string[]; // e.g., ["AC", "Music System", "GPS"]

  @Column('decimal', { precision: 10, scale: 2 })
  pricePerKm: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  basePrice: number; // Minimum charge

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ nullable: true })
  driverName: string;

  @Column({ nullable: true })
  driverPhone: string;

  @Column({ nullable: true })
  driverLicense: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'hostId' })
  host: User;

  @Column()
  hostId: string;
}
