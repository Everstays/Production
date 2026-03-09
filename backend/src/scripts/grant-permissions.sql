-- SQL script to grant necessary permissions to the database user
-- Run this script as a database superuser/admin (e.g., in Neon SQL Editor)
-- Replace 'everuser_dev' with your actual database username if different

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

-- Optional: Make the user the owner of the public schema (if you want full control)
-- ALTER SCHEMA public OWNER TO everuser_dev;
