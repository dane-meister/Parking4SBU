/**
 * Represents the Rate model for parking rates.
 * 
 * @typedef {Object} Rate
 * @property {number} id - The unique identifier for the rate. Auto-incremented primary key.
 * @property {string} permit_type - The type of permit (e.g., Faculty, Visitor, Residential Perimeter). Cannot be null.
 * @property {number} [hourly] - The hourly parking rate.
 * @property {number} [daily] - The daily parking rate.
 * @property {number} [max_hours] - The maximum number of hours allowed for parking.
 * @property {number} [monthly] - The monthly parking rate.
 * @property {number} [semesterly_fall_spring] - The parking rate for the fall and spring semesters.
 * @property {number} [semesterly_summer] - The parking rate for the summer semester.
 * @property {number} [yearly] - The yearly parking rate.
 * @property {string} [lot_start_time] - The start time for parking in the lot (in TIME format).
 * @property {string} [lot_end_time] - The end time for parking in the lot (in TIME format).
 * @property {number} [event_parking_price] - The parking rate for events.
 * @property {number} [sheet_number] - The sheet number associated with the rate.
 * @property {number} [sheet_price] - The price associated with the sheet number.
 */
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Rate', {
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
    sheet_price: DataTypes.FLOAT,
    // Foreign key column
    parking_lot_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'ParkingLots',
        key: 'id'
      },
      allowNull: false
    }
  });
} 