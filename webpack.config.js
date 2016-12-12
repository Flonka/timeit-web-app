var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');


module.exports = {

	devServer: {
		inline: true,
		context: 'build',
		port: 9999,
		proxy: {
			'/api': {
				target: 'http://localhost:8080'
			}
		}
	},

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
