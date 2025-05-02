module.exports = (sequelize, DataTypes) =>{
  return sequelize.define("ParkingLot", {
    id: {
      type: DataTypes.INTEGER, // Integer type for the primary key
      autoIncrement: true, // Auto-incrementing ID
      primaryKey: true, // Set as the primary key
    },
    name: {
      type: DataTypes.STRING, // String type for the parking lot name
      allowNull: false, // Name is required
    },
    location: {
      type: DataTypes.GEOMETRY("MULTIPOINT", 4326), // Geographic coordinates in WGS 84 format
      allowNull: false, // Location is required
    },
    mercator_coordinates: {
      type: DataTypes.GEOMETRY("MULTIPOINT", 3857), // Coordinates in Web Mercator projection
      allowNull: false, // Mercator coordinates are required
    },
    
    // Capacity and availability for different types of parking spaces
    capacity: DataTypes.INTEGER, // Total capacity of the parking lot
    faculty_capacity: DataTypes.INTEGER, // Capacity for faculty parking
    faculty_availability: DataTypes.INTEGER, // Available spaces for faculty parking
    commuter_perimeter_capacity: DataTypes.INTEGER, // Capacity for commuter perimeter parking
    commuter_perimeter_availability: DataTypes.INTEGER, // Available spaces for commuter perimeter parking
    commuter_core_capacity: DataTypes.INTEGER, // Capacity for commuter core parking
    commuter_core_availability: DataTypes.INTEGER, // Available spaces for commuter core parking
    commuter_satellite_capacity: DataTypes.INTEGER, // Capacity for commuter satellite parking
    commuter_satellite_availability: DataTypes.INTEGER, // Available spaces for commuter satellite parking
    metered_capacity: DataTypes.INTEGER, // Capacity for metered parking
    metered_availability: DataTypes.INTEGER, // Available spaces for metered parking
    resident_capacity: DataTypes.INTEGER, // Capacity for resident parking
    resident_availability: DataTypes.INTEGER, // Available spaces for resident parking
    resident_zone: {
      type: DataTypes.STRING, // Zone designation for resident parking
      allowNull: true, // Resident zone is optional
    },
    ada_capacity: DataTypes.INTEGER, // Capacity for ADA (accessible) parking
    ada_availability: DataTypes.INTEGER, // Available spaces for ADA parking
    ev_charging_capacity: DataTypes.INTEGER, // Capacity for EV charging stations
    ev_charging_availability: DataTypes.INTEGER, // Available EV charging stations
    general_capacity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    general_availability: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    covered: {
      type: DataTypes.BOOLEAN, // Boolean indicating if the parking lot is covered
      allowNull: false, // Covered status is required
    },
  });
} 