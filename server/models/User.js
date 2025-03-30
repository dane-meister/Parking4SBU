const { DataTypes } = require("sequelize"); // Import DataTypes from Sequelize for defining model attributes
const sequelize = require("../db"); // Import the Sequelize instance for database connection

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { is: /^[\d()+\-.\s]+$/i } // loosely matches phone formats
    },
    user_type: {
        type: DataTypes.ENUM('student', 'faculty', 'staff', 'visitor', 'admin'),
        allowNull: false
    },
    permit_type: {
        type: DataTypes.ENUM(
            'core', 'perimeter', 'satellite', 'faculty',
            'resident-zone1', 'resident-zone2', 'resident-zone3',
            'resident-zone4', 'resident-zone5', 'resident-zone6'), 
        allowNull: false
    },
    driver_license_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dl_state: {
        type: DataTypes.STRING(2),
        allowNull: false
    },
    address_line: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state_region: {
        type: DataTypes.STRING,
        allowNull: false
    },
    postal_zip_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Users',
    timestamps: true // createdAt, updatedAt
});

module.exports = User;
  