const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = process.env.SQLITE_PATH || path.join(__dirname, '../data/database.db');
    this.init();
  }

  init() {
    // Ensure data directory exists
    const dataDir = path.dirname(this.dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Create database connection
    this.db = new sqlite3.Database(this.dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
      }
      console.log('✅ Connected to SQLite database');
      this.createTables();
    });

    // Enable foreign keys
    this.db.run('PRAGMA foreign_keys = ON');
  }

  createTables() {
    const tables = [
      // Service Categories table
      `CREATE TABLE IF NOT EXISTS service_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        icon TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Service Providers table
      `CREATE TABLE IF NOT EXISTS service_providers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        line_id TEXT,
        service_category_id INTEGER,
        location TEXT,
        district TEXT,
        subdistrict TEXT,
        province TEXT DEFAULT 'ราชบุรี',
        description TEXT,
        price_range TEXT,
        available_days TEXT,
        available_hours TEXT,
        rating REAL DEFAULT 0,
        total_jobs INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (service_category_id) REFERENCES service_categories(id)
      )`,

      // Customers table
      `CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        line_id TEXT,
        location TEXT,
        district TEXT,
        subdistrict TEXT,
        province TEXT DEFAULT 'ราชบุรี',
        service_category_id INTEGER,
        job_description TEXT,
        budget_range TEXT,
        urgency_level TEXT DEFAULT 'medium',
        preferred_contact TEXT DEFAULT 'phone',
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (service_category_id) REFERENCES service_categories(id)
      )`,

      // Job Matches table
      `CREATE TABLE IF NOT EXISTS job_matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        provider_id INTEGER,
        customer_id INTEGER,
        match_score REAL DEFAULT 0,
        status TEXT DEFAULT 'pending',
        provider_response TEXT,
        customer_response TEXT,
        match_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        response_date DATETIME,
        completion_date DATETIME,
        rating INTEGER,
        feedback TEXT,
        FOREIGN KEY (provider_id) REFERENCES service_providers(id),
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      )`,

      // Match History table
      `CREATE TABLE IF NOT EXISTS match_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        match_id INTEGER,
        action TEXT NOT NULL,
        description TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (match_id) REFERENCES job_matches(id)
      )`,

      // Notifications table
      `CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_type TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'info',
        is_read BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    tables.forEach((sql, index) => {
      this.db.run(sql, (err) => {
        if (err) {
          console.error(`Error creating table ${index + 1}:`, err.message);
        }
      });
    });

    console.log('✅ Database tables created successfully');
  }

  // Helper method to run queries with promises
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  // Helper method to get single row
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Helper method to get all rows
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Close database connection
  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database connection closed');
        }
      });
    }
  }
}

// Export singleton instance
module.exports = new Database();