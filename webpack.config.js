// Webpack Plugins
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

// Post-css plugins
var autoprefixer = require('autoprefixer')

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
	postcss: [autoprefixer({browsers: ['last 2 versions']})],
	module: {
		loaders: [
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract(
					'style-loader',
					'css-loader!postcss-loader!sass-loader'
				)
			},
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				cacheDirectory: true
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './index.html'
		}),
		new ExtractTextPlugin('styles.[contenthash].css', {allChunks: true}),
	]
}
