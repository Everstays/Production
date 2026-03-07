/**
 * Database backup script - exports schema + data to SQL file
 * Run: npm run backup:db (from backend) or: npx ts-node src/scripts/backup-db.ts
 */
import { config } from 'dotenv';
import { Client } from 'pg';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

config({ path: join(process.cwd(), '.env') });

function escapeValue(v: unknown): string {
  if (v === null) return 'NULL';
  if (v instanceof Date) return `'${v.toISOString()}'`;
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (Buffer.isBuffer(v)) return `'\\\\x${v.toString('hex')}'`;
  if (typeof v === 'object') return `'${JSON.stringify(v).replace(/'/g, "''")}'`;
  return `'${String(v).replace(/'/g, "''")}'`;
}

async function backup() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'property_booking',
  });

  await client.connect();

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupDir = join(process.cwd(), '../../backups');
  mkdirSync(backupDir, { recursive: true });
  const outputPath = join(backupDir, `property_booking_${timestamp}.sql`);

  let sql = `-- EverStays Database Backup
-- Generated: ${new Date().toISOString()}
-- Database: ${process.env.DB_NAME || 'property_booking'}

SET client_encoding = 'UTF8';

`;

  const tablesResult = await client.query(`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename
  `);

  for (const { tablename } of tablesResult.rows) {
    // Get column definitions for CREATE TABLE
    const colsResult = await client.query(`
      SELECT column_name, data_type, character_maximum_length, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position
    `, [tablename]);

    const colDefs = colsResult.rows.map((c) => {
      let typ = c.data_type.toUpperCase();
      if (c.character_maximum_length) typ += `(${c.character_maximum_length})`;
      if (c.data_type === 'USER-DEFINED') typ = 'TEXT';
      return `  "${c.column_name}" ${typ}${c.is_nullable === 'NO' ? ' NOT NULL' : ''}${c.column_default ? ' DEFAULT ' + c.column_default : ''}`;
    }).join(',\n');
    sql += `\n-- Table: ${tablename}\n`;
    sql += `CREATE TABLE IF NOT EXISTS public."${tablename}" (\n${colDefs}\n);\n\n`;

    const dataResult = await client.query({ text: `SELECT * FROM "${tablename}"`, rowMode: 'array' });
    if (dataResult.rows.length > 0) {
      const cols = dataResult.fields.map((f) => `"${f.name}"`).join(', ');
      sql += `\n-- Data: ${tablename}\n`;
      for (const row of dataResult.rows) {
        const vals = dataResult.fields.map((_, i) => escapeValue(row[i])).join(', ');
        sql += `INSERT INTO public."${tablename}" (${cols}) VALUES (${vals});\n`;
      }
      sql += '\n';
    }
  }

  sql += `-- End of backup\n`;

  await client.end();
  writeFileSync(outputPath, sql, 'utf-8');
  console.log(`Backup saved to: ${outputPath}`);
}

backup().catch((err) => {
  console.error('Backup failed:', err);
  process.exit(1);
});
