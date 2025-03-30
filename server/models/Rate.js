const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const ParkingLot = require('./ParkingLot');

const Rate = sequelize.define('Rate', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  permit_type: {
    type: DataTypes.STRING, // e.g., Faculty, Visitor, Residential Perimeter
    allowNull: false
  },

  hourly: DataTypes.FLOAT,
  daily: DataTypes.FLOAT,
  max_hours: DataTypes.FLOAT,
  monthly: DataTypes.FLOAT,
  semesterly_fall_spring: DataTypes.FLOAT,
  semesterly_summer: DataTypes.FLOAT,
  yearly: DataTypes.FLOAT,
  lot_start_time: DataTypes.TIME,
  lot_end_time: DataTypes.TIME,
  event_parking_price: DataTypes.FLOAT,
  sheet_number: DataTypes.INTEGER,
  sheet_price: DataTypes.FLOAT
});

// FK relationship
Rate.belongsTo(ParkingLot, { foreignKey: 'lot_id' });
ParkingLot.hasMany(Rate, { foreignKey: 'lot_id' });

module.exports = Rate;
