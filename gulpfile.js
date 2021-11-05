import gulp from 'gulp';
import del from 'del';
import minimist from 'minimist';
import gulpEslint from 'gulp-eslint';
import stream from 'stream';
import * as rollup from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import source from 'vinyl-source-stream';
import svelte from 'rollup-plugin-svelte';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { default as throught2 } from 'through2';
import sourcemap from 'gulp-sourcemaps';
import stylus from 'gulp-stylus';
import concat from 'gulp-concat';
import cleanCSS from 'gulp-clean-css';


const { series, parallel, src, dest, watch } = gulp;
const noop = throught2.obj;

const isProd = minimist(process.argv.slice(2)).prod;
const DIST_PATH = 'dist/';

function eslint () {
	return src(['src/**/*.js', 'src/**/*.svelte', '*.js'])
		.pipe(gulpEslint())
		.pipe(gulpEslint.format())
		.pipe(gulpEslint.results(results => {
			if (results.errorCount) console.log('\x07');
		}));
}



function rollupBuild (inputOptions = {}, outputOptions = {}) {
	const readable = new stream.Readable();

	readable._read = function () { };
	rollup
		.rollup(inputOptions)
		.then(bundle => bundle.generate(outputOptions))
		.then(out => {
			if (!out.code) out = out.output[0];
			readable.push(out.code);
			if (outputOptions.output.sourcemap) {
				readable.push('\n//# sourceMappingURL=');
				readable.push(out.map.toUrl());
			}
			readable.push(null);
		})
		.catch(error => setTimeout(() => readable.emit('error', error)));
	return readable;
}


function js () {
	const inputOptions = {
		input: './src/index.js',
		plugins: [
			commonjs(),
			nodeResolve({
				extensions: ['.mjs', '.js', '.svelte', '.json'],
				dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
			}),
			svelte({ compilerOptions: {dev: !isProd, css: false } }),
			isProd && terser()
		]
	};
	const outputOptions = {output: {format: 'iife', sourcemap: !isProd}};
	return rollupBuild(inputOptions, outputOptions)
		.pipe(source('index.js'))
		.pipe(dest(DIST_PATH));
}


function css () {
	return src(['src/**/*.styl'])
		.pipe(isProd ? noop() : sourcemap.init())
		.pipe(stylus({ paths: ['src/ui'], 'include css': true }))
		.pipe(concat('index.css'))
		.pipe(isProd ? noop() : sourcemap.write())
		.pipe(isProd ? cleanCSS() : noop())
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

const _build = parallel(js, css, assets, htmls, eslint);
export const build = series(cleanup, _build);
export default series(build, watchTask);
