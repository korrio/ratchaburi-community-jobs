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
        bank_account_number TEXT,
        bank_account_name TEXT,
        bank_name TEXT,
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
        preferred_date TEXT,
        preferred_time TEXT,
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
        job_progress TEXT DEFAULT 'pending',
        provider_response TEXT,
        customer_response TEXT,
        match_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        response_date DATETIME,
        arrival_time DATETIME,
        start_time DATETIME,
        completion_date DATETIME,
        final_close_date DATETIME,
        rating INTEGER,
        feedback TEXT,
        estimated_duration TEXT,
        actual_duration TEXT,
        final_cost DECIMAL(10,2),
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
      )`,

      // Job Progress Tracking table
      `CREATE TABLE IF NOT EXISTS job_progress_tracking (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        match_id INTEGER NOT NULL,
        stage TEXT NOT NULL,
        status TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        location_info TEXT,
        images TEXT,
        updated_by TEXT,
        FOREIGN KEY (match_id) REFERENCES job_matches(id)
      )`,

      // Customer Feedback table (separate from questionnaires for progress tracking)
      `CREATE TABLE IF NOT EXISTS customer_job_feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        match_id INTEGER NOT NULL,
        service_rating INTEGER CHECK(service_rating >= 1 AND service_rating <= 5),
        quality_rating INTEGER CHECK(quality_rating >= 1 AND quality_rating <= 5),
        timeliness_rating INTEGER CHECK(timeliness_rating >= 1 AND timeliness_rating <= 5),
        overall_rating INTEGER CHECK(overall_rating >= 1 AND overall_rating <= 5),
        feedback_text TEXT,
        would_recommend BOOLEAN DEFAULT TRUE,
        would_hire_again BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (match_id) REFERENCES job_matches(id)
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
    
    // Run migrations for new fields
    this.runMigrations();
  }

  runMigrations() {
    // Add preferred_date and preferred_time columns to customers table if they don't exist
    this.db.all("PRAGMA table_info(customers)", (err, columns) => {
      if (err) {
        console.error('Error checking customers table structure:', err);
        return;
      }

      const columnNames = columns.map(col => col.name);
      
      if (!columnNames.includes('preferred_date')) {
        this.db.run("ALTER TABLE customers ADD COLUMN preferred_date TEXT", (err) => {
          if (err) {
            console.error('Error adding preferred_date column:', err);
          } else {
            console.log('✅ Added preferred_date column to customers table');
          }
        });
      }

      if (!columnNames.includes('preferred_time')) {
        this.db.run("ALTER TABLE customers ADD COLUMN preferred_time TEXT", (err) => {
          if (err) {
            console.error('Error adding preferred_time column:', err);
          } else {
            console.log('✅ Added preferred_time column to customers table');
          }
        });
      }
    });

    // Add guardian fields to service_providers table if they don't exist
    this.db.all("PRAGMA table_info(service_providers)", (err, columns) => {
      if (err) {
        console.error('Error checking service_providers table structure:', err);
        return;
      }

      const columnNames = columns.map(col => col.name);
      
      if (!columnNames.includes('guardian_name')) {
        this.db.run("ALTER TABLE service_providers ADD COLUMN guardian_name TEXT", (err) => {
          if (err) {
            console.error('Error adding guardian_name column:', err);
          } else {
            console.log('✅ Added guardian_name column to service_providers table');
          }
        });
      }

      if (!columnNames.includes('guardian_phone')) {
        this.db.run("ALTER TABLE service_providers ADD COLUMN guardian_phone TEXT", (err) => {
          if (err) {
            console.error('Error adding guardian_phone column:', err);
          } else {
            console.log('✅ Added guardian_phone column to service_providers table');
          }
        });
      }
    });
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