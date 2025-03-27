const { DataTypes } = require('sequelize');
const sequelize = require("../db"); 

// Define the Building model using Sequelize
const Building = sequelize.define('Building', {
  // Primary key: unique identifier for each building
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Campus name where the building is located
  campus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Name of the building
  building_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Geographic location of the building (latitude/longitude in WGS 84)
  location: {
    type: DataTypes.GEOMETRY('MULTIPOINT', 4326),
    allowNull: false,
  },
  // Mercator projection coordinates of the building
  mercator_coordinates: {
    type: DataTypes.GEOMETRY('MULTIPOINT', 3857),
    allowNull: false,
  },
}, {
  // Specify the table name in the database
  tableName: 'Buildings',
  // Disable automatic timestamps (createdAt, updatedAt)
  timestamps: false,
});

// Export the Building model for use in other parts of the application
module.exports = Building;
