import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { PropertiesModule } from './properties/properties.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';
import { OffersModule } from './offers/offers.module';
import { CitiesModule } from './cities/cities.module';
import { MessagesModule } from './messages/messages.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { ExperienceReviewsModule } from './experience-reviews/experience-reviews.module';
import { ContactsModule } from './contacts/contacts.module';
import { CategoriesModule } from './categories/categories.module';
import { HolidaysModule } from './holidays/holidays.module';
import { GuidesModule } from './guides/guides.module';
import { CabsModule } from './cabs/cabs.module';
import { CabRequestsModule } from './cab-requests/cab-requests.module';
import { TripPlanItemsModule } from './trip-plan-items/trip-plan-items.module';
import { TabBadgesModule } from './tab-badges/tab-badges.module';
import { UploadsModule } from './uploads/uploads.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(getTypeOrmConfig()),
    AuthModule,
    PropertiesModule,
    BookingsModule,
    ReviewsModule,
    UsersModule,
    OffersModule,
    CitiesModule,
    MessagesModule,
    ExperiencesModule,
    ExperienceReviewsModule,
    ContactsModule,
    CategoriesModule,
    HolidaysModule,
    GuidesModule,
    CabsModule,
    CabRequestsModule,
    TripPlanItemsModule,
    TabBadgesModule,
    UploadsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
