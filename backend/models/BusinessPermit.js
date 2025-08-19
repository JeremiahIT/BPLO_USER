// models/BusinessPermit.js
const { DataTypes } = require('sequelize');
const db = require('../config/database');

const BusinessPermit = db.define('BusinessPermit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  permit_number: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  business_type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  registration_number: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  business_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  tax_identification_number: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  trade_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  owner_first_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  owner_middle_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  owner_last_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  owner_extension_name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  owner_sex: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  mail_address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  telephone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  mobile: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  dti_certificate: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sec_certificate: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cda_certificate: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  bir_certificate: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'business_permits',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = BusinessPermit;