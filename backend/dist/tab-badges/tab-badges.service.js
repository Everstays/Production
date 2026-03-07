"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabBadgesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tab_badge_entity_1 = require("../entities/tab-badge.entity");
let TabBadgesService = class TabBadgesService {
    constructor(tabBadgeRepository) {
        this.tabBadgeRepository = tabBadgeRepository;
    }
    async findAll() {
        const badges = await this.tabBadgeRepository.find({
            where: { isActive: true },
            order: { tabId: 'ASC' },
        });
        return badges.filter((b) => b.badgeText && b.badgeText.trim());
    }
    async findAllForAdmin() {
        return this.tabBadgeRepository.find({ order: { tabId: 'ASC' } });
    }
    async upsert(tabId, badgeText) {
        let badge = await this.tabBadgeRepository.findOne({ where: { tabId } });
        if (badge) {
            badge.badgeText = badgeText && badgeText.trim() ? badgeText.trim() : null;
            return this.tabBadgeRepository.save(badge);
        }
        badge = this.tabBadgeRepository.create({ tabId, badgeText: badgeText?.trim() || null });
        return this.tabBadgeRepository.save(badge);
    }
    async remove(tabId) {
        return this.upsert(tabId, null);
    }
};
exports.TabBadgesService = TabBadgesService;
exports.TabBadgesService = TabBadgesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tab_badge_entity_1.TabBadge)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TabBadgesService);
//# sourceMappingURL=tab-badges.service.js.map