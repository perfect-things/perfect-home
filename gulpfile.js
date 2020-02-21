const { series, parallel, src, dest, watch } = require('gulp');
const del = require('del');

const isProd = require('minimist')(process.argv.slice(2)).prod;
const DIST_PATH = 'dist/';


function eslint () {
	const gulpEslint = require('gulp-eslint');
	return src(['src/**/*.js', 'src/**/*.svelte', '*.js'])
		.pipe(gulpEslint())
		.pipe(gulpEslint.format())
		.pipe(gulpEslint.results(results => {
			if (results.errorCount) console.log('\x07');
		}));
}


function js () {
	const rollup = require('gulp-rollup-lightweight');
	const source = require('vinyl-source-stream');
	const svelte = require('rollup-plugin-svelte');
	const resolve = require('@rollup/plugin-node-resolve');
	const {terser} = require('rollup-plugin-terser');

	const rollupConfig = {
		input: './src/index.js',
		output: {
			file: DIST_PATH + 'index.js',
			format: 'iife',
			sourcemap: !isProd,
		},
		plugins: [
			svelte({ dev: !isProd, css: false }),
			resolve({
				extensions: ['.mjs', '.js', '.svelte', '.json'],
				dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
			}),
			isProd && terser()
		]
	};

	return rollup(rollupConfig)
		.pipe(source('index.js', './src'))
		.pipe(dest(DIST_PATH));
}


function css () {
	const noop = require('through2').obj;
	const sourcemap = require('gulp-sourcemaps');
	const stylus = require('gulp-stylus');
	const concat = require('gulp-concat');

	return src(['src/**/*.styl'])
		.pipe(isProd ? noop() : sourcemap.init())
		.pipe(stylus({ paths: ['src/ui'], compress: isProd, 'include css': true }))
		.pipe(concat('index.css'))
		.pipe(isProd ? noop() : sourcemap.write())
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

const build = parallel(js, css, assets, htmls, eslint);
exports.build = series(cleanup, build);
exports.default = series(build, watchTask);
