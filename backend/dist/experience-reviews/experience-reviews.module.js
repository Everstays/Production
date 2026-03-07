"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExperienceReviewsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const experience_review_entity_1 = require("../entities/experience-review.entity");
const experience_entity_1 = require("../entities/experience.entity");
const experience_reviews_controller_1 = require("./experience-reviews.controller");
const experience_reviews_service_1 = require("./experience-reviews.service");
let ExperienceReviewsModule = class ExperienceReviewsModule {
};
exports.ExperienceReviewsModule = ExperienceReviewsModule;
exports.ExperienceReviewsModule = ExperienceReviewsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([experience_review_entity_1.ExperienceReview, experience_entity_1.Experience]),
        ],
        controllers: [experience_reviews_controller_1.ExperienceReviewsController],
        providers: [experience_reviews_service_1.ExperienceReviewsService],
    })
], ExperienceReviewsModule);
//# sourceMappingURL=experience-reviews.module.js.map