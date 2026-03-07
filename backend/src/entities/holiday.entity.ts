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

@Entity('holidays')
export class Holiday {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  destination: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  duration: number; // in days

  @Column('text', { array: true, default: [] })
  images: string[];

  @Column('text', { array: true, default: [] })
  inclusions: string[]; // What's included

  @Column('text', { array: true, default: [] })
  exclusions: string[]; // What's not included

  @Column('date')
  startDate: Date;

  @Column('date')
  endDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

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
