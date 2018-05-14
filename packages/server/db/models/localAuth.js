const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 4;

module.exports = (sequelize, DataTypes) => {
	const LocalAuth = sequelize.define("localAuth", {
		email: {
			primaryKey: true,
			type: DataTypes.STRING,
			validate: {
				isEmail: true,
				notNull: true,
				notEmpty: true
			}
		},
		password: {
			type: DataTypes.STRING,
			validate: {
				notNull: true,
				notEmpty: true
			}
		}
	});

	LocalAuth.associate = (models) => {
		LocalAuth.belongsTo(models.User, {
			foreignKey: 'id'
		});
	};

	LocalAuth.addHook('beforeSave', (model, options) => {
		return new Promise((resolve, reject) => {
			if (!model.changed('password')) resolve(model, options);

			bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
				if (err) return reject(err);

				bcrypt.hash(model.password, salt, (err, hash) => {
					if (err) return reject(err);

					model.password = hash;
					return resolve(model, options);
				});
			});
		});
	});

	return LocalAuth;
};