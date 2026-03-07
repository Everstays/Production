import { Repository } from 'typeorm';
import { TabBadge } from '../entities/tab-badge.entity';
export declare class TabBadgesService {
    private tabBadgeRepository;
    constructor(tabBadgeRepository: Repository<TabBadge>);
    findAll(): Promise<TabBadge[]>;
    findAllForAdmin(): Promise<TabBadge[]>;
    upsert(tabId: string, badgeText: string | null): Promise<TabBadge>;
    remove(tabId: string): Promise<TabBadge>;
}
