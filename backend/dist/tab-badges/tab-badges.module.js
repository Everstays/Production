"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabBadgesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tab_badge_entity_1 = require("../entities/tab-badge.entity");
const tab_badges_service_1 = require("./tab-badges.service");
const tab_badges_controller_1 = require("./tab-badges.controller");
let TabBadgesModule = class TabBadgesModule {
};
exports.TabBadgesModule = TabBadgesModule;
exports.TabBadgesModule = TabBadgesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([tab_badge_entity_1.TabBadge])],
        controllers: [tab_badges_controller_1.TabBadgesController],
        providers: [tab_badges_service_1.TabBadgesService],
        exports: [tab_badges_service_1.TabBadgesService],
    })
], TabBadgesModule);
//# sourceMappingURL=tab-badges.module.js.map