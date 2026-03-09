/**
 * Database initialization script - creates database and builds structure from entities
 * Run: npm run init:db (from backend) or: npx ts-node src/scripts/init-db.ts
 */
import { config } from 'dotenv';
import { Client } from 'pg';
import { join } from 'path';
import { AppDataSource } from '../config/database.config';

config({ path: join(process.cwd(), '.env') });

async function initDatabase() {
  const dbName = process.env.DB_NAME || 'property_booking';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT || '5432');
  const dbUsername = process.env.DB_USERNAME || 'postgres';
  const dbPassword = process.env.DB_PASSWORD || 'postgres';

  console.log('🚀 Starting database initialization...');
  console.log(`📊 Database: ${dbName}`);
  console.log(`🔗 Host: ${dbHost}:${dbPort}`);

  // Step 1: Connect to PostgreSQL server (using default 'postgres' database)
  // For cloud databases (like Neon), SSL is required
  const sslConfig = dbHost.includes('neon.tech') || dbHost.includes('aws.neon.tech') || process.env.DB_SSL === 'true'
    ? { rejectUnauthorized: false } // Allow self-signed certificates for cloud services
    : false;

  const adminClient = new Client({
    host: dbHost,
    port: dbPort,
    user: dbUsername,
    password: dbPassword,
    database: 'postgres', // Connect to default database first
    ssl: sslConfig,
  });

  try {
    await adminClient.connect();
    console.log('✅ Connected to PostgreSQL server');

    // Step 2: Check if database exists, create if it doesn't
    // Note: For cloud databases (like Neon), database creation might not be allowed
    // In that case, we'll skip creation and proceed with schema sync
    try {
      const dbCheckResult = await adminClient.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [dbName]
      );

      if (dbCheckResult.rows.length === 0) {
        console.log(`📦 Creating database '${dbName}'...`);
        await adminClient.query(`CREATE DATABASE "${dbName}"`);
        console.log(`✅ Database '${dbName}' created successfully`);
      } else {
        console.log(`✅ Database '${dbName}' already exists`);
      }
    } catch (dbError: any) {
      // If database creation fails (e.g., insufficient permissions), continue anyway
      if (dbError.code === '42501' || dbError.message?.includes('permission')) {
        console.log(`⚠️  Cannot create database (insufficient permissions). Assuming '${dbName}' exists.`);
      } else {
        throw dbError;
      }
    }

    await adminClient.end();
  } catch (error) {
    await adminClient.end();
    throw error;
  }

  // Step 3: Grant permissions on public schema (if needed for cloud databases)
  const targetClient = new Client({
    host: dbHost,
    port: dbPort,
    user: dbUsername,
    password: dbPassword,
    database: dbName,
    ssl: sslConfig,
  });

  try {
    await targetClient.connect();
    console.log('\n🔐 Checking database permissions...');
    
    // Check current user and permissions
    const userResult = await targetClient.query('SELECT current_user, current_database()');
    console.log(`   Current user: ${userResult.rows[0].current_user}`);
    console.log(`   Current database: ${userResult.rows[0].current_database}`);
    
    // Check if user has CREATE privilege on public schema
    const permResult = await targetClient.query(`
      SELECT has_schema_privilege(current_user, 'public', 'CREATE') as can_create,
             has_schema_privilege(current_user, 'public', 'USAGE') as can_use
    `);
    
    const canCreate = permResult.rows[0].can_create;
    const canUse = permResult.rows[0].can_use;
    
    console.log(`   CREATE privilege on public schema: ${canCreate ? '✅ Yes' : '❌ No'}`);
    console.log(`   USAGE privilege on public schema: ${canUse ? '✅ Yes' : '❌ No'}`);
    
    if (!canCreate) {
      console.log('\n⚠️  WARNING: Your database user does not have CREATE privileges on the public schema.');
      console.log('   This is required to create tables, types, and other database objects.');
      console.log('\n💡 Solutions:');
      console.log('   1. Run the SQL script: src/scripts/grant-permissions.sql in your Neon SQL Editor');
      console.log('      (You need to run it as a database admin/superuser)');
      console.log('   2. Or manually run: GRANT CREATE ON SCHEMA public TO everuser_dev;');
      console.log('   3. Or connect as a user with CREATE privileges');
      console.log('\n   After granting permissions, run this script again: npm run init:db');
      console.log('\n   Attempting to continue anyway...\n');
    }
    
    try {
      // Try to make the current user the owner of public schema (if possible)
      await targetClient.query(`ALTER SCHEMA public OWNER TO "${dbUsername}"`);
      console.log('✅ Schema ownership set');
    } catch (ownerError: any) {
      // If we can't set ownership, try granting permissions
      try {
        await targetClient.query('GRANT CREATE ON SCHEMA public TO CURRENT_USER');
        await targetClient.query('GRANT ALL ON SCHEMA public TO CURRENT_USER');
        await targetClient.query('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO CURRENT_USER');
        await targetClient.query('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO CURRENT_USER');
        await targetClient.query('GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO CURRENT_USER');
        await targetClient.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO CURRENT_USER');
        await targetClient.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO CURRENT_USER');
        console.log('✅ Permissions granted');
      } catch (permError: any) {
        // If permission grant fails, continue anyway (might already have permissions)
        if (permError.code === '42501') {
          console.log('⚠️  Cannot grant permissions (insufficient privileges).');
        } else {
          console.log('⚠️  Permission setup warning:', permError.message);
        }
      }
    }
    await targetClient.end();
  } catch (error) {
    await targetClient.end();
    // Continue anyway - might be able to proceed without grants
    console.log('⚠️  Could not check/set up permissions, continuing...');
  }

  // Step 4: Initialize TypeORM DataSource and synchronize schema
  console.log('\n🔧 Initializing TypeORM DataSource...');
  
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✅ TypeORM DataSource initialized');
    }

    console.log('📐 Synchronizing database schema from entities...');
    // synchronize(false) will create/update tables without dropping existing data
    await AppDataSource.synchronize(false);
    console.log('✅ Database schema synchronized successfully');

    // Step 5: Display created tables
    const tablesResult = await AppDataSource.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `);

    console.log('\n📋 Created tables:');
    tablesResult.forEach((row: { tablename: string }) => {
      console.log(`   - ${row.tablename}`);
    });

    console.log(`\n✅ Database initialization completed!`);
    console.log(`   Total tables: ${tablesResult.length}`);

    await AppDataSource.destroy();
  } catch (error) {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    throw error;
  }
}

initDatabase().catch((err) => {
  console.error('\n❌ Database initialization failed:', err.message);
  if (err.code === '42501') {
    console.error('\n📝 This is a permissions issue. Please:');
    console.error('   1. Open your Neon dashboard SQL Editor');
    console.error('   2. Run the SQL commands from: src/scripts/grant-permissions.sql');
    console.error('   3. Then run this script again: npm run init:db');
  }
  process.exit(1);
});
