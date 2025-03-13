const { DataTypes } = require('sequelize');
const sequelize = require("../db.js"); 

const Building = sequelize.define('Building', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  campus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  building_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.GEOMETRY('MULTIPOINT', 4326), // Latitude/Longitude (WGS 84)
    allowNull: false,
  },
  mercator_coordinates: {
    type: DataTypes.GEOMETRY('MULTIPOINT', 3857), // Web Mercator projection
    allowNull: false,
  },
}, {
  tableName: 'Buildings',
  timestamps: false,
});

module.exports = Building;
