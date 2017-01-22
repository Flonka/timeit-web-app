const process = require('process')
// Webpack Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const TARGET = process.env.npm_lifecycle_event

const BUILD_DIR = 'build/'

const common = {
	resolve: {
		extensions: ['.js', '.jsx', '.scss']
	},
	entry: {
		app: './timeit/main',
		vendor: ['react', 'react-dom']
	},
	output: {
		path: BUILD_DIR,
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract({
					fallbackLoader: 'style-loader',
					loader: [
						{
							loader: 'css-loader',
							options: {
								minimize: true
							}
						},
						{
							loader: 'postcss-loader',
						},
						{
							loader: 'sass-loader',
							options: {
								includePaths: ['./node_modules/foundation-sites/scss']
							}
						}

					]
				})
			},
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
			}
		]
	},
	plugins: [
		new webpack.BannerPlugin("Timeit webapplication by Flonka"),
		new HtmlWebpackPlugin({
			template: './index.html'
		}),
		new ExtractTextPlugin({
			filename:'[name].[contenthash].css',
			allChunks: true
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names: ['vendor', 'manifest'],
			filename: '[name].[chunkhash].js'
		}),
		new CleanWebpackPlugin([BUILD_DIR]),
		new webpack.NoEmitOnErrorsPlugin()
	]
}

function isVendor(module, count) {
	const userRequest = module.userRequest
	return userRequest && userRequest.indexOf('node_modules') >= 0
}


const dev = {
	output: {
		filename: '[name].js',
	},
	devtool: 'eval-source-map',
	plugins: [
		new webpack.NamedModulesPlugin()
	]
}

const prod = {
	output: {
		filename: 'app.[chunkhash].js',
		chunkFilename: '[chunkhash].js',
	},
	devtool: 'source-map',
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			mangle: {
				except: ['webpackJsonp']
			}
		}),
		new webpack.optimize.DedupePlugin(),
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
