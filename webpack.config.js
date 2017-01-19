const process = require('process')
// Webpack Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')

// Post-css plugins
const autoprefixer = require('autoprefixer')

const TARGET = process.env.npm_lifecycle_event

const BUILD_DIR = 'build/'

const common = {
	resolve: {
		extensions: ['', '.js', '.jsx', '.scss']
	},
	entry: {
		app: './timeit/main',
		vendor: ['react', 'react-dom']
	},
	output: {
		path: BUILD_DIR,
		filename: 'app.[chunkhash].js'
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
		new webpack.BannerPlugin("Timeit webapplication by Flonka"),
		new HtmlWebpackPlugin({
			template: './index.html'
		}),
		new ExtractTextPlugin(
			'styles.[contenthash].css',
			{allChunks: true}
		),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: 'vendor.[chunkhash].js',
			minChunks: isVendor
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new CleanWebpackPlugin([BUILD_DIR]),
		new webpack.NoErrorsPlugin()
	]
}

function isVendor(module, count) {
	const userRequest = module.userRequest
	return userRequest && userRequest.indexOf('node_modules') >= 0
}


const dev = {
	debug: true,
	devtool: 'eval-source-map',
	plugins: [
		new webpack.NamedModulesPlugin()
	]
}

const prod = {
	devtool: 'source-map',
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			},
			mangle: {
				except: ['webpackJsonp']
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production')
		}),
	]
}

var buildConfig
switch (TARGET) {
	case 'build-prod':
		buildConfig = merge.smart(
			common,
			prod)
		break
	case 'build-dev':
		buildConfig = merge.smart(
			common,
			dev)
		break
	case 'start':
		buildConfig = merge.smart(
			common,
			dev,
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
