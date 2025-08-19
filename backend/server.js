const sequelize = require('./config/database');
const User = require('./models/User');
const Renewal = require('./models/Renewal');
require('dotenv').config();

async function setupDatabase() {
  try {
    console.log('🔧 Setting up BPLO database...');

    // Test Sequelize connection
    await sequelize.authenticate();
    console.log('✅ Supabase PostgreSQL connection successful');

    // Sync Sequelize models
    console.log('🔄 Syncing Sequelize models...');
    await sequelize.sync({ force: false }); // Set to true for testing to drop/recreate tables
    console.log('✅ Sequelize models (User, Renewal) synced');

    // Display database summary
    let userCount = 0;
    let renewalCount = 0;

    try {
      userCount = await User.count();
    } catch (error) {
      console.log('⚠️ Could not count Users table:', error.message);
    }

    try {
      renewalCount = await Renewal.count();
    } catch (error) {
      console.log('⚠️ Could not count Renewals table:', error.message);
    }

    console.log('\n📊 Database Summary:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Renewals: ${renewalCount}`);

    console.log('\n🎉 Database setup completed successfully!');
    console.log('🚀 You can now start the server with: npm run dev');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    throw error;
  }
}

if (require.main === module) {
  setupDatabase().catch((err) => {
    console.error('Setup failed:', err);
    process.exit(1);
  });
}

module.exports = { setupDatabase };