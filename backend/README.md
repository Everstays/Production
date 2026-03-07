# Property Booking Platform - Backend API

A comprehensive NestJS backend API for the Property Booking Platform with PostgreSQL database.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (User, Host, Admin)
- **Property Management**: CRUD operations for properties with search and filtering
- **Booking System**: Complete booking management with availability checking
- **Reviews & Ratings**: Review system for properties
- **User Management**: User profiles, wishlists, and settings
- **Offers & Promotions**: Discount codes and promotional offers
- **Messaging**: Communication between hosts and guests
- **City Management**: City discovery and property counts

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (Passport)
- **Validation**: class-validator, class-transformer

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=property_booking
JWT_SECRET=your-secret-key
```

4. Create the database:
```bash
createdb property_booking
```

5. Run migrations (if using migrations):
```bash
npm run migration:run
```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Properties
- `GET /properties` - Get all properties (with filters)
- `GET /properties/:id` - Get property by ID
- `POST /properties` - Create property (Host/Admin only)
- `PATCH /properties/:id` - Update property
- `DELETE /properties/:id` - Delete property
- `GET /properties/my-properties` - Get host's properties

### Bookings
- `POST /bookings` - Create a booking
- `GET /bookings` - Get user's bookings
- `GET /bookings/:id` - Get booking by ID
- `PATCH /bookings/:id` - Update booking
- `POST /bookings/:id/cancel` - Cancel booking

### Reviews
- `POST /reviews` - Create a review
- `GET /reviews` - Get all reviews (optional propertyId filter)
- `GET /reviews/:id` - Get review by ID
- `PATCH /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

### Users
- `GET /users/me` - Get current user profile
- `GET /users/:id` - Get user by ID
- `PATCH /users/me` - Update user profile
- `PATCH /users/me/host-settings` - Update host settings
- `POST /users/wishlist/:propertyId` - Add to wishlist
- `DELETE /users/wishlist/:propertyId` - Remove from wishlist
- `GET /users/wishlist/me` - Get wishlist

### Offers
- `GET /offers` - Get all active offers
- `GET /offers/:id` - Get offer by ID
- `GET /offers/code/:code` - Get offer by code
- `POST /offers` - Create offer (Admin only)
- `PATCH /offers/:id` - Update offer (Admin only)
- `DELETE /offers/:id` - Delete offer (Admin only)

### Cities
- `GET /cities` - Get all cities
- `GET /cities/:id` - Get city by ID

### Messages
- `POST /messages` - Send a message
- `GET /messages` - Get all messages
- `GET /messages/conversation/:userId` - Get conversation
- `GET /messages/unread-count` - Get unread count
- `PATCH /messages/:id/read` - Mark message as read

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Database Schema

### Entities
- **User**: Users, hosts, and admins
- **Property**: Property listings
- **Booking**: Booking records
- **Review**: Property reviews
- **Offer**: Promotional offers
- **City**: City information
- **Message**: Messages between users

## Development

### Running Migrations
```bash
npm run migration:generate -- -n MigrationName
npm run migration:run
npm run migration:revert
```

### Testing
```bash
npm run test
npm run test:watch
npm run test:e2e
```

## Environment Variables

- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRES_IN` - JWT expiration time
- `PORT` - Server port
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

## License

MIT
