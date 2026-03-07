import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TabBadge } from '../entities/tab-badge.entity';
import { CreateTabBadgeDto, UpdateTabBadgeDto } from '../dto/tab-badge.dto';

@Injectable()
export class TabBadgesService {
  constructor(
    @InjectRepository(TabBadge)
    private tabBadgeRepository: Repository<TabBadge>,
  ) {}

  async findAll(): Promise<TabBadge[]> {
    const badges = await this.tabBadgeRepository.find({
      where: { isActive: true },
      order: { tabId: 'ASC' },
    });
    return badges.filter((b) => b.badgeText && b.badgeText.trim());
  }

  async findAllForAdmin(): Promise<TabBadge[]> {
    return this.tabBadgeRepository.find({ order: { tabId: 'ASC' } });
  }

  async upsert(tabId: string, badgeText: string | null): Promise<TabBadge> {
    let badge = await this.tabBadgeRepository.findOne({ where: { tabId } });
    if (badge) {
      badge.badgeText = badgeText && badgeText.trim() ? badgeText.trim() : null;
      return this.tabBadgeRepository.save(badge);
    }
    badge = this.tabBadgeRepository.create({ tabId, badgeText: badgeText?.trim() || null });
    return this.tabBadgeRepository.save(badge);
  }

  async remove(tabId: string): Promise<TabBadge> {
    return this.upsert(tabId, null);
  }
}
