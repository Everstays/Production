# Database Setup for Production

This guide will help you initialize your database schema for production.

## Prerequisites

1. ✅ Database credentials are configured in `.env` file
2. ✅ SSL configuration has been added to database configs
3. ✅ Database user has proper permissions

## Step 1: Grant Database Permissions (if needed)

If you're using a cloud database (Neon, Supabase, etc.), you may need to grant permissions first.

### Option A: Using Neon SQL Editor

1. Open your Neon dashboard
2. Go to SQL Editor
3. Run the SQL script from `src/scripts/grant-permissions.sql`:

```sql
-- Grant CREATE privilege on public schema
GRANT CREATE ON SCHEMA public TO everuser_dev;

-- Grant ALL privileges on public schema
GRANT ALL ON SCHEMA public TO everuser_dev;

-- Grant privileges on existing objects
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO everuser_dev;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO everuser_dev;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO everuser_dev;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO everuser_dev;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO everuser_dev;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO everuser_dev;
```

**Note:** Replace `everuser_dev` with your actual database username if different.

### Option B: Using psql command line

```bash
psql "host=your-db-host port=5432 dbname=postgres user=your-admin-user sslmode=require" -f src/scripts/grant-permissions.sql
```

## Step 2: Verify .env File

Make sure your `.env` file in `Production/backend/` contains:

```env
DB_HOST=your-database-host
DB_PORT=5432
DB_USERNAME=everuser_dev
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
DB_SSL=true
```

## Step 3: Build Backend (on server)

```bash
cd /var/www/webapp/backend  # or your actual backend path
npm install
npm run build
```

## Step 4: Initialize Database Schema

Run the database initialization script:

```bash
cd /var/www/webapp/backend
npm run init:db
```

This script will:
- ✅ Connect to your database
- ✅ Create the database if it doesn't exist (for local PostgreSQL)
- ✅ Check and grant permissions
- ✅ Create all tables from TypeORM entities
- ✅ Display all created tables

## Step 5: Verify Database Tables

After initialization, you should see output like:

```
✅ Database initialization completed!
   Total tables: 20

📋 Created tables:
   - user
   - property
   - booking
   - review
   - offer
   - city
   - message
   - experience
   - contact
   - category
   - holiday
   - guide
   - cab
   - cab_request
   - trip_plan_item
   - tab_badge
   - guide_review
   - guide_booking
   - notification
   - experience_review
```

## Step 6: Restart Backend

After database is initialized, restart your backend:

```bash
pm2 restart everstays-backend
pm2 logs everstays-backend
```

## Troubleshooting

### Error: "password authentication failed"

- Check your `.env` file has correct `DB_PASSWORD`
- Verify password matches your database provider
- Make sure PM2 is loading environment variables

### Error: "permission denied" or "insufficient privileges"

- Run the `grant-permissions.sql` script in your database SQL editor
- Make sure you're using a user with CREATE privileges
- For Neon: Use the SQL Editor in dashboard
- For Supabase: Use the SQL Editor in dashboard

### Error: "connection is insecure"

- Make sure `DB_SSL=true` is set in `.env`
- Or ensure your database host includes 'neon.tech', 'supabase', etc. (auto-detected)

### Error: "database does not exist"

- For cloud databases: Create the database manually in your provider dashboard
- For local PostgreSQL: The script will create it automatically

## What Gets Created?

The initialization script creates tables for:

- **Users & Auth**: User accounts, authentication
- **Properties**: Property listings, images, amenities
- **Bookings**: Reservation system
- **Reviews**: Property and experience reviews
- **Offers**: Promotional offers and discounts
- **Cities**: City data and geocoding
- **Experiences**: Activity/tour listings
- **Guides**: Tour guide management
- **Cabs**: Cab service management
- **Categories**: Property and experience categories
- **Messages**: User messaging system
- **Notifications**: User notifications
- **Trip Planning**: Trip planning items
- **Tab Badges**: UI badge system

All tables are created with proper relationships, indexes, and constraints based on your TypeORM entities.
