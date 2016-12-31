// Webpack Plugins
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var webpack = require('webpack')

// Post-css plugins
var autoprefixer = require('autoprefixer')

module.exports = {
	resolve: {
		extensions: ['', '.js', '.jsx', '.scss']
	},
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
	entry: './timeit/main',
	output: {
		path: 'build/',
		filename: 'app.js'
	},
	sassLoader: {
		includePaths: ['./node_modules/foundation-sites/scss']
	},
	postcss: [autoprefixer({
		browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']
	})],
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
		new ExtractTextPlugin(
			'styles.[contenthash].css',
			{allChunks: true}
		),
		new webpack.NoErrorsPlugin()
	]
}
