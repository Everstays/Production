import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Property } from '../entities/property.entity';
import { Booking } from '../entities/booking.entity';
import { Review } from '../entities/review.entity';
import { Offer } from '../entities/offer.entity';
import { City } from '../entities/city.entity';
import { Message } from '../entities/message.entity';
import { Experience } from '../entities/experience.entity';
import { Contact } from '../entities/contact.entity';
import { Category } from '../entities/category.entity';
import { Holiday } from '../entities/holiday.entity';
import { Guide } from '../entities/guide.entity';
import { Cab } from '../entities/cab.entity';
import { CabRequest } from '../entities/cab-request.entity';
import { TripPlanItem } from '../entities/trip-plan-item.entity';
import { TabBadge } from '../entities/tab-badge.entity';
import { GuideReview } from '../entities/guide-review.entity';
import { GuideBooking } from '../entities/guide-booking.entity';
import { Notification } from '../entities/notification.entity';
import { ExperienceReview } from '../entities/experience-review.entity';

export const getTypeOrmConfig = (): TypeOrmModuleOptions => {
  const password = process.env.DB_PASSWORD || '';
  
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: password,
    database: process.env.DB_NAME || 'property_booking',
    entities: [User, Property, Booking, Review, Offer, City, Message, Experience, Contact, Category, Holiday, Guide, Cab, CabRequest, TripPlanItem, TabBadge, GuideReview, GuideBooking, Notification, ExperienceReview],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
    extra: {
      // Handle empty password for local PostgreSQL
      ...(password === '' && { trustLocalhost: true }),
    },
  };
};
