module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Reservation', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        // FK to User
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        // FK to Parking Lot
        parking_lot_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        // FK to Vehicle
        vehicle_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        // Timestamp range for the reservation
        start_time: {
            type: DataTypes.DATE,
            allowNull: false
        },

        end_time: {
            type: DataTypes.DATE,
            allowNull: false
        },

        // Total Price charged
        total_price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },

        // Number of spots reserved
        spot_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },

        // Optional event description
        event_description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        
        // Reservation status
        status: {
            type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
            allowNull: false,
            defaultValue: 'pending'
        }
    });
}