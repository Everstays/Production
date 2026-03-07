"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuidesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const guides_service_1 = require("./guides.service");
const guides_controller_1 = require("./guides.controller");
const guide_reviews_controller_1 = require("./guide-reviews.controller");
const guide_reviews_service_1 = require("./guide-reviews.service");
const guide_bookings_controller_1 = require("./guide-bookings.controller");
const guide_bookings_host_controller_1 = require("./guide-bookings-host.controller");
const guide_bookings_service_1 = require("./guide-bookings.service");
const guide_entity_1 = require("../entities/guide.entity");
const guide_review_entity_1 = require("../entities/guide-review.entity");
const guide_booking_entity_1 = require("../entities/guide-booking.entity");
let GuidesModule = class GuidesModule {
};
exports.GuidesModule = GuidesModule;
exports.GuidesModule = GuidesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([guide_entity_1.Guide, guide_review_entity_1.GuideReview, guide_booking_entity_1.GuideBooking]),
        ],
        controllers: [
            guides_controller_1.GuidesController,
            guide_reviews_controller_1.GuideReviewsController,
            guide_bookings_controller_1.GuideBookingsController,
            guide_bookings_host_controller_1.GuideBookingsHostController,
        ],
        providers: [guides_service_1.GuidesService, guide_reviews_service_1.GuideReviewsService, guide_bookings_service_1.GuideBookingsService],
        exports: [guides_service_1.GuidesService, guide_reviews_service_1.GuideReviewsService, guide_bookings_service_1.GuideBookingsService],
    })
], GuidesModule);
//# sourceMappingURL=guides.module.js.map