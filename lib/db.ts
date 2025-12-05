import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';

// Database file path
const DB_PATH = process.env.DATABASE_PATH || './goals.db';

// Create/connect to database
let db: Database.Database | null = null;
let initialized = false;

function ensureDbConnection(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    // Enable foreign keys (if needed in future)
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function ensureDbInitialized() {
  if (!initialized) {
    const connection = ensureDbConnection();

    // Create table
    connection.exec(`
      CREATE TABLE IF NOT EXISTS goal_submissions (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        name TEXT,
        goals_data TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        payment_status TEXT DEFAULT 'pending',
        payment_id TEXT,
        payment_amount REAL,
        scheduled_send_date TEXT,
        email_sent INTEGER DEFAULT 0,
        email_sent_at TEXT
      )
    `);

    // Create index
    connection.exec(`
      CREATE INDEX IF NOT EXISTS idx_scheduled_emails
      ON goal_submissions(scheduled_send_date)
      WHERE email_sent = 0 AND payment_status = 'completed'
    `);

    console.log("Database initialized successfully");
    initialized = true;
  }
}

export function getDb(): Database.Database {
  ensureDbConnection();
  ensureDbInitialized();
  return db!;
}

// Initialize database schema (can be called manually if needed)
export function initDatabase() {
  ensureDbConnection();
  ensureDbInitialized();
}

// Helper: Generate UUID for new records
export function generateId(): string {
  return uuidv4();
}

// Helper: Get current timestamp in ISO format
export function now(): string {
  return new Date().toISOString();
}

// Helper: Get date one year from now
export function oneYearFromNow(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

// Export the db instance
export { db };
