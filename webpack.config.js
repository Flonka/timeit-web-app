const process = require('process')
// Webpack Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')

// Post-css plugins
const autoprefixer = require('autoprefixer')

const TARGET = process.env.npm_lifecycle_event

const common = {
	resolve: {
		extensions: ['', '.js', '.jsx', '.scss']
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

var buildConfig
switch (TARGET) {
	case 'build':
		buildConfig = merge(common)
		break
	case 'start':
		buildConfig = merge(
			common,
			{devServer: {
				inline: true,
				context: 'build',
				port: 9999,
				proxy: {
					'/api': {
						target: 'http://localhost:8080'
					}
				}
			}}
		)
		break
}

module.exports = buildConfig
