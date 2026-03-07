import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Booking } from './booking.entity';
import { Review } from './review.entity';
import { Category } from './category.entity';

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  LIMITED = 'limited',
  BOOKED = 'booked',
}

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  city: string;

  @Column('text', { array: true })
  images: string[];

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  hostRating: number;

  @Column('decimal', { precision: 10, scale: 2 })
  pricePerNight: number;

  @Column({
    type: 'enum',
    enum: AvailabilityStatus,
    default: AvailabilityStatus.AVAILABLE,
  })
  availability: AvailabilityStatus;

  @Column('text')
  description: string;

  @Column('text', { array: true, default: [] })
  amenities: string[];

  @Column('text', { array: true, default: [] })
  houseRules: string[];

  @Column('text')
  cancellationPolicy: string;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column()
  bedrooms: number;

  @Column()
  bathrooms: number;

  @Column()
  maxGuests: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.properties)
  @JoinColumn({ name: 'hostId' })
  host: User;

  @Column()
  hostId: string;

  @ManyToOne(() => Category, { nullable: true, eager: false })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ nullable: true })
  categoryId: string;

  @OneToMany(() => Booking, (booking) => booking.property)
  bookings: Booking[];

  @OneToMany(() => Review, (review) => review.property)
  reviews: Review[];
}
