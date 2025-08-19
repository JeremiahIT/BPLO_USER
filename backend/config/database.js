const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DATABASE_URL ||
    `postgres://${process.env.SUPABASE_DB_USER}:${process.env.SUPABASE_DB_PASSWORD}@${process.env.SUPABASE_DB_HOST}:${process.env.SUPABASE_DB_PORT}/${process.env.SUPABASE_DB_NAME}?sslmode=require`,
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Supabase requires this
      },
    },
    pool: {
      max: 5,      // 👈 limit max clients (free tier allows ~10 total)
      min: 0,
      acquire: 30000,
      idle: 10000, // release idle connections fast
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Connected to Supabase PostgreSQL database (Sequelize)');
  })
  .catch((err) => {
    console.error('❌ Sequelize connection error:', err.message);
    process.exit(1);
  });

module.exports = sequelize;
