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

export enum OfferType {
  BANK = 'bank',
  SEASONAL = 'seasonal',
  FIRST_TIME = 'first-time',
  LONG_STAY = 'long-stay',
  HOST = 'host',
}

export enum DiscountType {
  FIXED = 'fixed',       // e.g. Rs.1500 OFF
  PERCENTAGE = 'percentage',  // e.g. 50% OFF
}

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  discount: number;

  @Column({
    type: 'enum',
    enum: DiscountType,
    default: DiscountType.FIXED,
  })
  discountType: DiscountType;

  @Column({ type: 'date', nullable: true })
  validFrom: Date;

  @Column({ type: 'date' })
  expiryDate: Date;

  @Column({
    type: 'enum',
    enum: OfferType,
  })
  type: OfferType;

  @Column({ nullable: true, unique: true })
  code: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  bankName: string;

  @Column({ nullable: true })
  terms: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'hostId' })
  host: User;

  @Column({ nullable: true })
  hostId: string;
}
