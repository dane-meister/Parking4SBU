/**
 * Sequelize model definition for the User entity.
 * Represents a user in the system with various attributes such as personal details,
 * contact information, and user-specific classifications.
 * 
 * @typedef {Object} Vehicle
 * @property {number} vehicle_id - The unique identifier for a vehicle. Auto-incremented primary key.
 * @property {string} plate - a vehicle's plate number. Can't be null.
 * @property {string} make - a vehicle's make. Can't be null.
 * @property {string} model - a vehicle's model. Can't be null.
 * @property {string} year - a vehicle's year. Can't be null.
 * @property {string} color - a vehicle's color. Can't be null.
 * @see {@link https://sequelize.org/} for more information on Sequelize models.
 */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Vehicle', {
        vehicle_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        plate: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        make: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        year: { // year validated frontend side
            type: DataTypes.STRING,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isDefault: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    }, {
        tableName: 'Vehicles',
        timestamps: true // createdAt, updatedAt
    });
} 