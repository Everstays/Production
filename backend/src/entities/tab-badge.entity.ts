import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tab_badges')
export class TabBadge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  tabId: string; // 'stays' | 'hire-guide' | 'cab-facility'

  @Column({ nullable: true })
  badgeText: string | null; // e.g. 'Upto 50% Off', null = no badge

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
