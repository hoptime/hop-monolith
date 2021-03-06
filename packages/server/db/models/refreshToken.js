module.exports = (sequelize, DataTypes) => {
	const RefreshToken = sequelize.define("RefreshToken", {
		refreshToken: {
			primaryKey: true,
			type: DataTypes.STRING,
			validate: {
				notEmpty: true
			}
		}
	});

	RefreshToken.associate = (models) => {
		RefreshToken.belongsTo(models.User, {
			foreignKey: 'userId'
		});
	};

	return RefreshToken;
};
