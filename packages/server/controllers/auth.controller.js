const jwt = require("jsonwebtoken");

const JWT_ISSUER = "Hop Authentication";
const ACCESS_TOKEN_EXPIRE_TIME = "5 minutes";
const REFRESH_TOKEN_EXPIRE_TIME = "60 minutes";

const { AUTH_SECRET } = process.env;

function createAccessToken(userId) {
	return jwt.sign(
		{
			userId
		},
		AUTH_SECRET,
		{
			expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
			issuer: JWT_ISSUER
		}
	);
}

function createRefreshToken(userId) {
	return jwt.sign(
		{
			type: "refresh",
			userId
		},
		AUTH_SECRET,
		{
			expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
			issuer: JWT_ISSUER
		}
	);
}

module.exports = (db, controller) => ({
	refresh: (refreshToken) => {
		const decoded = jwt.verify(refreshToken, AUTH_SECRET);
	},
	login: ({ email, password }) => {

	},
	signup: ({ firstName, lastName, email, password }) => {
		return new Promise((resolve, reject) => {
			db.User.create({
				firstName,
				lastName
			}).then((user) => {
				return db.LocalAuth.create({
					userId: user.userId,
					email,
					password
				}).then((localAuth) => {
					return resolve({
						accessToken: createAccessToken(user.id),
						refreshToken: createRefreshToken(user.id)
					});
				}).catch((err) => {
					reject(err);
				});
			}).catch((err) => {
				reject(err);
			});
		});
	}
});
