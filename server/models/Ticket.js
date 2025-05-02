module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Ticket', {
		summons_number: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		},
		plate: DataTypes.STRING,
		permit: DataTypes.STRING,
		location: DataTypes.TEXT,
		space: DataTypes.STRING,
		violation: {
			type: DataTypes.STRING,
			allowNull: false
		},
		comments: DataTypes.TEXT,
		fine: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false
		},
		issued_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		},
		status: {
			type: DataTypes.ENUM('unpaid', 'paid', 'appealed'),
			defaultValue: 'unpaid'
		},
		appeal_reason: DataTypes.TEXT,
		appeal_submitted_at: DataTypes.DATE,
		officer_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
	});
}