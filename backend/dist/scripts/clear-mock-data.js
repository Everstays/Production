"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const path_1 = require("path");
const database_config_1 = require("../config/database.config");
const review_entity_1 = require("../entities/review.entity");
const booking_entity_1 = require("../entities/booking.entity");
const property_entity_1 = require("../entities/property.entity");
const cab_request_entity_1 = require("../entities/cab-request.entity");
const message_entity_1 = require("../entities/message.entity");
(0, dotenv_1.config)({ path: (0, path_1.join)(process.cwd(), '.env') });
async function clearMockData() {
    try {
        await database_config_1.AppDataSource.initialize();
        console.log('Database connected.');
        const cabRequestRepo = database_config_1.AppDataSource.getRepository(cab_request_entity_1.CabRequest);
        const messageRepo = database_config_1.AppDataSource.getRepository(message_entity_1.Message);
        const reviewRepo = database_config_1.AppDataSource.getRepository(review_entity_1.Review);
        const bookingRepo = database_config_1.AppDataSource.getRepository(booking_entity_1.Booking);
        const propertyRepo = database_config_1.AppDataSource.getRepository(property_entity_1.Property);
        const cabReqDeleted = await cabRequestRepo.createQueryBuilder().delete().execute();
        console.log('Cab requests deleted:', cabReqDeleted.affected ?? 0);
        const messagesDeleted = await messageRepo.createQueryBuilder().delete().execute();
        console.log('Messages deleted:', messagesDeleted.affected ?? 0);
        const reviewsDeleted = await reviewRepo.createQueryBuilder().delete().execute();
        console.log('Reviews deleted:', reviewsDeleted.affected ?? 0);
        const bookingsDeleted = await bookingRepo.createQueryBuilder().delete().execute();
        console.log('Bookings deleted:', bookingsDeleted.affected ?? 0);
        const propertiesDeleted = await propertyRepo.createQueryBuilder().delete().execute();
        console.log('Properties deleted:', propertiesDeleted.affected ?? 0);
        console.log('Mock data cleared. My Properties will show empty until you add new ones.');
    }
    catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
    finally {
        if (database_config_1.AppDataSource.isInitialized) {
            await database_config_1.AppDataSource.destroy();
        }
    }
}
clearMockData();
//# sourceMappingURL=clear-mock-data.js.map