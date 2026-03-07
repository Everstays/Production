"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_config_1 = require("./config/typeorm.config");
const auth_module_1 = require("./auth/auth.module");
const properties_module_1 = require("./properties/properties.module");
const bookings_module_1 = require("./bookings/bookings.module");
const reviews_module_1 = require("./reviews/reviews.module");
const users_module_1 = require("./users/users.module");
const offers_module_1 = require("./offers/offers.module");
const cities_module_1 = require("./cities/cities.module");
const messages_module_1 = require("./messages/messages.module");
const experiences_module_1 = require("./experiences/experiences.module");
const experience_reviews_module_1 = require("./experience-reviews/experience-reviews.module");
const contacts_module_1 = require("./contacts/contacts.module");
const categories_module_1 = require("./categories/categories.module");
const holidays_module_1 = require("./holidays/holidays.module");
const guides_module_1 = require("./guides/guides.module");
const cabs_module_1 = require("./cabs/cabs.module");
const cab_requests_module_1 = require("./cab-requests/cab-requests.module");
const trip_plan_items_module_1 = require("./trip-plan-items/trip-plan-items.module");
const tab_badges_module_1 = require("./tab-badges/tab-badges.module");
const uploads_module_1 = require("./uploads/uploads.module");
const notifications_module_1 = require("./notifications/notifications.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRoot((0, typeorm_config_1.getTypeOrmConfig)()),
            auth_module_1.AuthModule,
            properties_module_1.PropertiesModule,
            bookings_module_1.BookingsModule,
            reviews_module_1.ReviewsModule,
            users_module_1.UsersModule,
            offers_module_1.OffersModule,
            cities_module_1.CitiesModule,
            messages_module_1.MessagesModule,
            experiences_module_1.ExperiencesModule,
            experience_reviews_module_1.ExperienceReviewsModule,
            contacts_module_1.ContactsModule,
            categories_module_1.CategoriesModule,
            holidays_module_1.HolidaysModule,
            guides_module_1.GuidesModule,
            cabs_module_1.CabsModule,
            cab_requests_module_1.CabRequestsModule,
            trip_plan_items_module_1.TripPlanItemsModule,
            tab_badges_module_1.TabBadgesModule,
            uploads_module_1.UploadsModule,
            notifications_module_1.NotificationsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map