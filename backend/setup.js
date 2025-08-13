const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'bplo_database',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function setupDatabase() {
  try {
    console.log('🔧 Setting up BPLO database...');

    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');

    // Check if ALL required tables exist
    const requiredTables = ['business_permits', 'regions', 'provinces', 'cities', 'barangays', 'requirements', 'permit_requirements', 'application_status_history'];
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = ANY($1)
    `, [requiredTables]);

    const existingTables = tableCheck.rows.map(row => row.table_name);
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));

    if (missingTables.length > 0) {
      console.log(`📋 Creating database schema... (Missing tables: ${missingTables.join(', ')})`);
      
      // Read and execute schema file
      const fs = require('fs');
      const path = require('path');
      const schemaPath = path.join(__dirname, 'database', 'schema.sql');
      
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schema);
        console.log('✅ Database schema created successfully');
      } else {
        console.error('❌ Schema file not found at:', schemaPath);
        return;
      }
    } else {
      console.log('✅ Database schema already exists');
    }



    // Display database info (with error handling)
    let permitCount = 0;
    let regionCount = 0;
    
    try {
      const permitResult = await pool.query('SELECT COUNT(*) FROM business_permits');
      permitCount = permitResult.rows[0].count;
    } catch (error) {
      console.log('⚠️  Could not count permits table');
    }
    
    try {
      const regionResult = await pool.query('SELECT COUNT(*) FROM regions');
      regionCount = regionResult.rows[0].count;
    } catch (error) {
      console.log('⚠️  Could not count regions table');
    }
    
    console.log('\n📊 Database Summary:');
    console.log(`   Permits: ${permitCount}`);
    console.log(`   Regions: ${regionCount}`);

    console.log('\n🎉 Database setup completed successfully!');
    console.log('🚀 You can now start the server with: npm run dev');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    throw error; // Re-throw the error instead of exiting
  }
  // Remove pool.end() so the connection stays alive for the server
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 