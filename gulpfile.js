const { series, parallel, src, dest, watch } = require('gulp');
const del = require('del');
const isProd = require('minimist')(process.argv.slice(2)).prod;
const DIST_PATH = 'dist/';

function webpackLogger (err) {
	const chalk = require('chalk');
	let time = new Date().toTimeString().substr(0,8);
	let message = 'Finished ' + chalk.green('webpack') + ' build';
	if (err) { message = chalk.red(err); time = chalk.red(time); }
	else time = chalk.grey(time);
	console.log(`[${time}] ${message}`); /* eslint no-console: 0 */
}


function eslint () {
	const gulpEslint = require('gulp-eslint');
	return src(['src/**/*.js', 'src/**/*.svelte', '*.js'])
		.pipe(gulpEslint())
		.pipe(gulpEslint.format());
}


function js () {
	const path = require('path');
	const webpack = require('webpack');
	const webpackStream = require('webpack-stream');
	const webpackConfig = {
		entry: { index: './src/index.js' },
		output: {
			filename: 'index.js',
			path: path.join(__dirname, DIST_PATH),
		},
		resolve: { extensions: ['.mjs', '.js', '.json', '.svelte'] },
		module: {
			rules: [
				{ test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
				{
					test: /\.svelte$/,
					exclude: /node_modules/,
					use: { loader: 'svelte-loader', options: { css: false } },
				},
			]
		}
	};

	if (!isProd) {
		webpackConfig.mode = 'development';
		webpackConfig.devtool = 'inline-source-map';
	}
	else {
		const MinifyPlugin = require('babel-minify-webpack-plugin');
		webpackConfig.plugins = [ new MinifyPlugin() ];
	}

	return src(['src/index.js'])
		.pipe(webpackStream(webpackConfig, webpack, webpackLogger))
		.on('error', function (e) {
			console.log(e.message);
			this.emit('end');
		})
		.pipe(dest(DIST_PATH));
}


function css () {
	const cssmin = require('gulp-clean-css');
	const sourcemaps = require('gulp-sourcemaps');
	const concat = require('gulp-concat');
	const stylus = require('gulp-stylus');
	const noop = require('through2').obj;

	return src(['src/**/*.styl'])
		.pipe(isProd ? noop() : sourcemaps.init())
		.pipe(stylus({ paths: ['src/ui'], 'include css': true }))
		.pipe(isProd ? cssmin({ keepSpecialComments: 0 }) : noop())
		.pipe(concat('index.css'))
		.pipe(isProd ? noop() : sourcemaps.write())
		.pipe(dest(DIST_PATH));
}

function assets () {
	return src(['src/assets/**/*.*']).pipe(dest(DIST_PATH + 'assets/'));
}

function htmls () {
	return src(['src/*.html', 'src/*.json']).pipe(dest(DIST_PATH));
}

function cleanup () {
	return del(['dist/*']);
}

function watchTask (done) {
	if (isProd) return done();
	watch('src/**/*.styl', css);
	watch('src/**/*.{js,svelte}', parallel(eslint, js));
	watch('src/*.html', htmls);
	watch('src/assets/**/*.*', assets);
}


exports.build = parallel(js, css, assets, htmls, eslint);
exports.default = series(cleanup, exports.build, watchTask);
