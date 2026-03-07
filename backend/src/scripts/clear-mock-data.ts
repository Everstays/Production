/**
 * Clears mock/example data: properties, their bookings and reviews.
 * Run from backend: npm run clear-mock-data
 */
import { config } from 'dotenv';
import { join } from 'path';
import { AppDataSource } from '../config/database.config';
import { Review } from '../entities/review.entity';
import { Booking } from '../entities/booking.entity';
import { Property } from '../entities/property.entity';
import { CabRequest } from '../entities/cab-request.entity';
import { Message } from '../entities/message.entity';

config({ path: join(process.cwd(), '.env') });

async function clearMockData() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected.');

    const cabRequestRepo = AppDataSource.getRepository(CabRequest);
    const messageRepo = AppDataSource.getRepository(Message);
    const reviewRepo = AppDataSource.getRepository(Review);
    const bookingRepo = AppDataSource.getRepository(Booking);
    const propertyRepo = AppDataSource.getRepository(Property);

    // Delete in order: tables that reference properties first, then properties
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
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

clearMockData();
