/**
 * Sequelize model definition for the User entity.
 * Represents a user in the system with various attributes such as personal details,
 * contact information, and user-specific classifications.
 * 
 * @typedef {Object} User
 * @property {number} user_id - The unique identifier for the user. Auto-incremented primary key.
 * @property {string} password - The hashed password for the user. Cannot be null.
 * @property {string} email - The user's email address. Must be unique and a valid email format.
 * @property {string} first_name - The user's first name. Cannot be null.
 * @property {string} last_name - The user's last name. Cannot be null.
 * @property {string} [phone_number] - The user's phone number. Optional, must loosely match phone formats.
 * @property {'faculty'|'resident'|'commuter'|'visitor'|'admin'} user_type - The type of user. Cannot be null.
 * @property {'faculty'|'faculty-life-sciences-1'|'faculty-life-sciences-2'|'faculty-garage-gated-1'|'faculty-garage-gated-2'|'premium'|'resident-zone1'|'resident-zone2'|'resident-zone3'|'resident-zone4'|'resident-zone5'|'resident-zone6'|'core'|'perimeter'|'satellite'|'visitor'} permit_type - The parking permit type assigned to the user. Cannot be null.
 * @property {string} driver_license_number - The user's driver license number. Cannot be null.
 * @property {string} dl_state - The state where the user's driver license was issued. Cannot be null.
 * @property {string} address_line - The user's street address. Cannot be null.
 * @property {string} city - The city of the user's address. Cannot be null.
 * @property {string} state_region - The state or region of the user's address. Cannot be null.
 * @property {string} postal_zip_code - The postal or zip code of the user's address. Cannot be null.
 * @property {string} country - The country of the user's address. Cannot be null.
 * @property {boolean} isApproved - Indicates whether the user's account is approved. Defaults to false.
 * 
 * @see {@link https://sequelize.org/} for more information on Sequelize models.
 */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
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
            type: DataTypes.ENUM('faculty', 'resident', 'commuter', 'visitor', 'admin'),
            allowNull: false
        },
        permit_type: {
            type: DataTypes.ENUM(
                'faculty', 'faculty-life-sciences-1', 'faculty-life-sciences-2', 'faculty-garage-gated-1', 'faculty-garage-gated-2', 'premium',
                'resident-zone1', 'resident-zone2', 'resident-zone3', 'resident-zone4', 'resident-zone5', 'resident-zone6',
                'core', 'perimeter', 'satellite',
                'visitor'),
            allowNull: false
        },
        driver_license_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dl_state: {
            type: DataTypes.STRING,
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
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        tableName: 'Users',
        timestamps: true // createdAt, updatedAt
    });
} 