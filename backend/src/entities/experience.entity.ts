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

export enum ExperienceCategory {
  CULTURE = 'Culture',
  FOOD = 'Food',
  ADVENTURE = 'Adventure',
  WELLNESS = 'Wellness',
  NATURE = 'Nature',
  PHOTOGRAPHY = 'Photography',
  ART = 'Art',
  MUSIC = 'Music',
  OTHER = 'Other',
}

@Entity('experiences')
export class Experience {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  city: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  duration: string;

  @Column({
    type: 'enum',
    enum: ExperienceCategory,
    default: ExperienceCategory.OTHER,
  })
  category: ExperienceCategory;

  @Column('text', { array: true, default: [] })
  images: string[];

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ nullable: true })
  maxParticipants: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'hostId' })
  host: User;

  @Column()
  hostId: string;
}
