const dotenv = require("dotenv").config();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

const mode = (isProd) ?
	'production' :
	'development';

const PORT = process.env.PORT || 3000;
const DEV_PROXY = process.env.DEV_PROXY || `https://localhost:${PORT}`;

const CLIENT_DIR = path.resolve('./');
const CLIENT_ENTRY = path.join(CLIENT_DIR, 'Client.js');
const CLIENT_OUTPUT = path.join(__dirname, './bundle');
const CLIENT_TEMPLATE = path.resolve('./index.html');

module.exports = {
	entry: {
		bundle: ['babel-polyfill', CLIENT_ENTRY]
	},
	mode,
	output: {
		path: CLIENT_OUTPUT,
		publicPath: '/',
		filename: '[name].[chunkhash].js'
	},
	module: {
		rules: [
			{
				use: 'babel-loader',
				test: /\.js$/,
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: CLIENT_TEMPLATE
		})
	],
	devServer: {
		historyApiFallback: {
			disableDotRule: true,
			index: '/'
		},
		compress: true,
		proxy: {
			'/graphql': {
				target: DEV_PROXY,
				changeOrigin: true
			}
		}
	}
};
