import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Guide } from './guide.entity';

@Entity('guide_reviews')
export class GuideReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rating: number;

  @Column('text')
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Guide)
  @JoinColumn({ name: 'guideId' })
  guide: Guide;

  @Column()
  guideId: string;
}
