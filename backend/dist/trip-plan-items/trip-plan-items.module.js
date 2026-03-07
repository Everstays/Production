"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripPlanItemsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const trip_plan_item_entity_1 = require("../entities/trip-plan-item.entity");
const trip_plan_items_service_1 = require("./trip-plan-items.service");
const trip_plan_items_controller_1 = require("./trip-plan-items.controller");
let TripPlanItemsModule = class TripPlanItemsModule {
};
exports.TripPlanItemsModule = TripPlanItemsModule;
exports.TripPlanItemsModule = TripPlanItemsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([trip_plan_item_entity_1.TripPlanItem])],
        controllers: [trip_plan_items_controller_1.TripPlanItemsController],
        providers: [trip_plan_items_service_1.TripPlanItemsService],
        exports: [trip_plan_items_service_1.TripPlanItemsService],
    })
], TripPlanItemsModule);
//# sourceMappingURL=trip-plan-items.module.js.map