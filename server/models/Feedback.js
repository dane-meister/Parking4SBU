/**
 * Sequelize model definition for the Feedback entity.
 * Represents user-submitted feedback with a numeric rating and comment text.
 * 
 * @typedef {Object} Feedback
 * @property {number} feedback_id - Auto-incremented primary key for the feedback.
 * @property {number} user_id - The ID of the user who submitted the feedback (foreign key).
 * @property {string} feedback_text - The feedback content. Cannot be null.
 * @property {number} rating - A numeric rating (1–5). Cannot be null.
 * @property {boolean} isRead - Flag to indicate if the feedback has been read by an admin.
 * @see {@link https://sequelize.org/} for more information on Sequelize models.
 */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Feedback', {
        feedback_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        feedback_text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5,
            }
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        admin_response: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'Feedbacks',
        timestamps: true // adds createdAt and updatedAt
    });
};