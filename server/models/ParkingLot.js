const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const ParkingLot = sequelize.define("ParkingLot", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.GEOMETRY("MULTIPOINTZ", 4326),
    allowNull: false,
  },
  mercator_coordinates: {
    type: DataTypes.GEOMETRY("MULTIPOINTZ", 3857),
    allowNull: false,
  },
  
  capacity: DataTypes.INTEGER,
  faculty_capacity: DataTypes.INTEGER,
  faculty_availability: DataTypes.INTEGER,
  commuter_perimeter_capacity: DataTypes.INTEGER,
  commuter_perimeter_availability: DataTypes.INTEGER,
  commuter_core_capacity: DataTypes.INTEGER,
  commuter_core_availability: DataTypes.INTEGER,
  commuter_satellite_capacity: DataTypes.INTEGER,
  commuter_satellite_availability: DataTypes.INTEGER,
  metered_capacity: DataTypes.INTEGER,
  metered_availability: DataTypes.INTEGER,
  resident_capacity: DataTypes.INTEGER,
  resident_availability: DataTypes.INTEGER,
  resident_zone: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  ada_capacity: DataTypes.INTEGER,
  ada_availability: DataTypes.INTEGER,
  ev_charging_capacity: DataTypes.INTEGER,
  ev_charging_availability: DataTypes.INTEGER,
  covered: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = ParkingLot;
