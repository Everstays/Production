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

export enum GuideLanguage {
  ENGLISH = 'English',
  HINDI = 'Hindi',
  MALAYALAM = 'Malayalam',
  TAMIL = 'Tamil',
  TELUGU = 'Telugu',
  KANNADA = 'Kannada',
  OTHER = 'Other',
}

@Entity('guides')
export class Guide {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  pricePerDay: number;

  @Column('text', { array: true, default: [] })
  images: string[];

  @Column('text', { array: true, default: [] })
  languages: string[]; // Array of GuideLanguage values

  @Column('text', { array: true, default: [] })
  specialties: string[]; // e.g., ["Historical Tours", "Food Tours", "Adventure"]

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
  phoneNumber: string;

  @Column({ nullable: true })
  email: string;

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
