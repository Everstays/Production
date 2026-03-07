import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Experience } from './experience.entity';

@Entity('experience_reviews')
export class ExperienceReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rating: number;

  @Column('text', { default: '' })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Experience)
  @JoinColumn({ name: 'experienceId' })
  experience: Experience;

  @Column()
  experienceId: string;
}
