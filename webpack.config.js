var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');



module.exports = {

	entry: './main.js',
	output: {
		path: 'build/',
		filename: 'app.js'
	},
	sassLoader: {
		includePaths: ['./node_modules/foundation-sites/scss']

	},
	module: {
		loaders: [
			{
				test: /\.scss$/,
				loader: 'style!css!sass'
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './index.html'
		}),
	]
}
