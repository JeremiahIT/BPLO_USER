const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DATABASE_URL || `postgres://${process.env.SUPABASE_DB_USER}:${process.env.SUPABASE_DB_PASSWORD}@${process.env.SUPABASE_DB_HOST}:${process.env.SUPABASE_DB_PORT}/${process.env.SUPABASE_DB_NAME}`,
  {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Connected to Supabase PostgreSQL database (Sequelize)');
  })
  .catch((err) => {
    console.error('❌ Sequelize connection error:', err);
    process.exit(-1);
  });

module.exports = sequelize;