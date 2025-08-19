const { Pool } = require('pg');
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const sequelize = require('./config/database'); // Sequelize instance
const User = require('../models/User');
const Renewal = require('./models/Renewal');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'bplo_database',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function setupDatabase() {
  try {
    console.log('🔧 Setting up BPLO database...');

    // Test PostgreSQL connection
    await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL connection successful');

    // Check if required tables exist
    const requiredTables = [
      'business_permits',
      'regions',
      'provinces',
      'cities',
      'barangays',
      'requirements',
      'permit_requirements',
      'application_status_history',
    ];
    const tableCheck = await pool.query(
      `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = ANY($1)
    `,
      [requiredTables]
    );

    const existingTables = tableCheck.rows.map((row) => row.table_name);
    const missingTables = requiredTables.filter((table) => !existingTables.includes(table));

    if (missingTables.length > 0) {
      console.log(`📋 Creating database schema... (Missing tables: ${missingTables.join(', ')})`);
      const schemaPath = path.join(__dirname, 'database', 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schema);
        console.log('✅ Database schema created successfully');
      } else {
        console.error('❌ Schema file not found at:', schemaPath);
        throw new Error('Schema file missing');
      }
    } else {
      console.log('✅ Database schema already exists');
    }

    // Sync Sequelize models
    console.log('🔄 Syncing Sequelize models...');
    await sequelize.sync({ force: false }); // Set to true for testing to drop/recreate
    console.log('✅ Sequelize models (User, Renewal) synced');

    // Display database summary
    let permitCount = 0;
    let regionCount = 0;
    let userCount = 0;
    let renewalCount = 0;

    try {
      const permitResult = await pool.query('SELECT COUNT(*) FROM business_permits');
      permitCount = permitResult.rows[0].count;
    } catch (error) {
      console.log('⚠️ Could not count business_permits table:', error.message);
    }

    try {
      const regionResult = await pool.query('SELECT COUNT(*) FROM regions');
      regionCount = regionResult.rows[0].count;
    } catch (error) {
      console.log('⚠️ Could not count regions table:', error.message);
    }

    try {
      const userResult = await User.count();
      userCount = userResult;
    } catch (error) {
      console.log('⚠️ Could not count Users table:', error.message);
    }

    try {
      const renewalResult = await Renewal.count();
      renewalCount = renewalResult;
    } catch (error) {
      console.log('⚠️ Could not count Renewals table:', error.message);
    }

    console.log('\n📊 Database Summary:');
    console.log(`   Permits: ${permitCount}`);
    console.log(`   Regions: ${regionCount}`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Renewals: ${renewalCount}`);

    console.log('\n🎉 Database setup completed successfully!');
    console.log('🚀 You can now start the server with: npm run dev');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    throw error; // Re-throw to handle in server.js
  }
  // Do not end pool; keep it alive for server
}

// Run setup if executed directly
if (require.main === module) {
  setupDatabase().catch((err) => {
    console.error('Setup failed:', err);
    process.exit(1);
  });
}

module.exports = { setupDatabase };