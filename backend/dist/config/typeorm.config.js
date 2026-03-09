"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeOrmConfig = void 0;
const user_entity_1 = require("../entities/user.entity");
const property_entity_1 = require("../entities/property.entity");
const booking_entity_1 = require("../entities/booking.entity");
const review_entity_1 = require("../entities/review.entity");
const offer_entity_1 = require("../entities/offer.entity");
const city_entity_1 = require("../entities/city.entity");
const message_entity_1 = require("../entities/message.entity");
const experience_entity_1 = require("../entities/experience.entity");
const contact_entity_1 = require("../entities/contact.entity");
const category_entity_1 = require("../entities/category.entity");
const holiday_entity_1 = require("../entities/holiday.entity");
const guide_entity_1 = require("../entities/guide.entity");
const cab_entity_1 = require("../entities/cab.entity");
const cab_request_entity_1 = require("../entities/cab-request.entity");
const trip_plan_item_entity_1 = require("../entities/trip-plan-item.entity");
const tab_badge_entity_1 = require("../entities/tab-badge.entity");
const guide_review_entity_1 = require("../entities/guide-review.entity");
const guide_booking_entity_1 = require("../entities/guide-booking.entity");
const notification_entity_1 = require("../entities/notification.entity");
const experience_review_entity_1 = require("../entities/experience-review.entity");
const getTypeOrmConfig = () => {
    const password = process.env.DB_PASSWORD || '';
    const dbHost = process.env.DB_HOST || 'localhost';
    const sslConfig = dbHost.includes('neon.tech') || 
                    dbHost.includes('aws.neon.tech') || 
                    dbHost.includes('supabase') ||
                    dbHost.includes('.rds.amazonaws.com') ||
                    process.env.DB_SSL === 'true'
                    ? { rejectUnauthorized: false } // Allow self-signed certificates for cloud services
    : false;
    return {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'postgres',
        password: password,
        database: process.env.DB_NAME || 'property_booking',
        entities: [user_entity_1.User, property_entity_1.Property, booking_entity_1.Booking, review_entity_1.Review, offer_entity_1.Offer, city_entity_1.City, message_entity_1.Message, experience_entity_1.Experience, contact_entity_1.Contact, category_entity_1.Category, holiday_entity_1.Holiday, guide_entity_1.Guide, cab_entity_1.Cab, cab_request_entity_1.CabRequest, trip_plan_item_entity_1.TripPlanItem, tab_badge_entity_1.TabBadge, guide_review_entity_1.GuideReview, guide_booking_entity_1.GuideBooking, notification_entity_1.Notification, experience_review_entity_1.ExperienceReview],
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV === 'development',
        ssl: sslConfig,
        extra: {
            ...(password === '' && { trustLocalhost: true }),
        },
    };
};
exports.getTypeOrmConfig = getTypeOrmConfig;
//# sourceMappingURL=typeorm.config.js.map