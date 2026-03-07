import { TabBadgesService } from './tab-badges.service';
export declare class TabBadgesController {
    private readonly tabBadgesService;
    constructor(tabBadgesService: TabBadgesService);
    findAll(): Promise<import("../entities/tab-badge.entity").TabBadge[]>;
    findAllForAdmin(): Promise<import("../entities/tab-badge.entity").TabBadge[]>;
    upsert(tabId: string, badgeText: string | null): Promise<import("../entities/tab-badge.entity").TabBadge>;
    remove(tabId: string): Promise<import("../entities/tab-badge.entity").TabBadge>;
}
