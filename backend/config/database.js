const { Sequelize } = require('sequelize');
const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL Pool for raw queries
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

// Sequelize instance for ORM
const sequelize = new Sequelize(
  process.env.DATABASE_URL || `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
);

// Test connections
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database (Pool)');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Connected to PostgreSQL database (Sequelize)');
  })
  .catch((err) => {
    console.error('❌ Sequelize connection error:', err);
    process.exit(-1);
  });

module.exports = {
  sequelize, // For ORM (User, Renewal models)
  pool, // For raw queries (setup.js, other routes)
  query: (text, params) => pool.query(text, params), // Convenience method for raw queries
};