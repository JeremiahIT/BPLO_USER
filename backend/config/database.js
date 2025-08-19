const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.SUPABASE_DB_NAME,   // Database name
  process.env.SUPABASE_DB_USER,   // User
  process.env.SUPABASE_DB_PASSWORD, // Password
  {
    host: process.env.SUPABASE_DB_HOST, // Supabase host
    port: process.env.SUPABASE_DB_PORT || 5432,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Required for Supabase SSL
      },
    },
    pool: {
      max: 5,      // Supabase free tier allows ~10 connections total
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Test connection
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connected to Supabase PostgreSQL database (Sequelize)");
  })
  .catch((err) => {
    console.error("❌ Sequelize connection error:", err.message);
    process.exit(1);
  });

module.exports = sequelize;
