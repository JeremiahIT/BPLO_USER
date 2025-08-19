const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,      // Database name
  process.env.DB_USER,      // User
  process.env.DB_PASSWORD,  // Password
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // ✅ Required for Supabase SSL
      }
    },
    pool: {
      max: 5,
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
    console.log("✅ Connected to Supabase PostgreSQL database (Sequelize, SSL enabled)");
  })
  .catch((err) => {
    console.error("❌ Sequelize connection error:", err); // log full error
    process.exit(1);
  });

module.exports = sequelize;
