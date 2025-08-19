const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Renewal = sequelize.define('Renewal', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  businessName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  businessAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ownerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  businessType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  grossReceipts: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  barangayClearance: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fireSafetyCert: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cedulaNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  timestamps: true,
});

User.hasMany(Renewal, { foreignKey: 'userId' });
Renewal.belongsTo(User, { foreignKey: 'userId' });

module.exports = Renewal;