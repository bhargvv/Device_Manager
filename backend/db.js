const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
});

async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS devices (
      id INT AUTO_INCREMENT PRIMARY KEY,

      machine_name VARCHAR(100) NOT NULL,
      finance_asset_id VARCHAR(50) NOT NULL UNIQUE,

      asset_state VARCHAR(50) NOT NULL,
      asset_condition VARCHAR(50) NOT NULL,

      site VARCHAR(100) NOT NULL,
      device_type VARCHAR(50) NOT NULL,

      manufacturer VARCHAR(100),
      model VARCHAR(100),

      serial_number VARCHAR(100) UNIQUE,

      assigned_user VARCHAR(100),

      finance_cap_date DATE,

      remarks TEXT,

      backup_check VARCHAR(20),

      trend VARCHAR(50),

      in_navin_list VARCHAR(50),

      os VARCHAR(100),

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Run migrations for legacy schemas
  try {
    const [typeCols] = await pool.query("SHOW COLUMNS FROM devices LIKE 'type'");
    if (typeCols.length > 0) {
      console.log("🔧 Migrating legacy schema: renaming 'type' column to 'device_type'...");
      await pool.query("ALTER TABLE devices RENAME COLUMN type TO device_type");
      console.log("✅ Column 'type' successfully renamed to 'device_type'");
    }
  } catch (err) {
    console.error("⚠️ Migration error while renaming 'type' column:", err);
  }

  try {
    const [updatedAtCols] = await pool.query("SHOW COLUMNS FROM devices LIKE 'updated_at'");
    if (updatedAtCols.length === 0) {
      console.log("🔧 Migrating legacy schema: adding 'updated_at' column...");
      await pool.query("ALTER TABLE devices ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
      console.log("✅ Column 'updated_at' successfully added");
    }
  } catch (err) {
    console.error("⚠️ Migration error while adding 'updated_at' column:", err);
  }

  console.log("✅ Devices table ready");
}

module.exports = { pool, initDatabase };
