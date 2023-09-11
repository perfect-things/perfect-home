import gulp from 'gulp';
import { createGulpEsbuild } from 'gulp-esbuild';
import { default as throught2 } from 'through2';
import { deleteAsync } from 'del';
import stylus from 'gulp-stylus';
import concat from 'gulp-concat';
import cleanCSS from 'gulp-clean-css';

import minimist from 'minimist';
// eslint-disable-next-line import/no-unresolved
import gulpEslint from 'gulp-eslint-new';
import livereload from 'gulp-livereload';
import NodeResolve from '@esbuild-plugins/node-resolve';
import sveltePlugin from 'esbuild-svelte';


const { series, parallel, src, dest } = gulp;
const noop = throught2.obj;

const DIST_PATH = 'dist/';
const isProd = minimist(process.argv.slice(2)).prod;
let gulpEsbuild = createGulpEsbuild({ incremental: false });

const cleanup = () => deleteAsync(['dist/*']);
const assets = () => src(['src/assets/**/*.*']).pipe(dest(DIST_PATH));
const htmls = () => src(['src/*.html', 'src/*.json']).pipe(dest(DIST_PATH));

export function eslint () {
	return src(['src/**/*.js', 'src/**/*.svelte', '*.js'])
		.pipe(gulpEslint({ fix: true }))   // Lint files, create fixes.
		.pipe(gulpEslint.fix())            // Fix files if necessary.
		.pipe(gulpEslint.format())
		.pipe(gulpEslint.results(results => {
			if (results.errorCount) console.log('\x07');    // beep
		}));
}


export function css () {
	return src('src/**/*.styl', { sourcemaps: !isProd })
		.pipe(stylus({ 'include css': true }))
		.pipe(concat('index.css'))
		.pipe(isProd ? cleanCSS() : noop())
		.pipe(dest(DIST_PATH, { sourcemaps: '.' }))
		.pipe(livereload());
}


export function js () {
	const cfg = {
		outfile: 'index.js',
		mainFields: ['svelte', 'browser', 'module', 'main'],
		bundle: true,
		minify: isProd,
		sourcemap: !isProd,
		loader: { '.svg': 'text' },
		logLevel: 'warning',
		legalComments: 'none',
		format: 'iife',
		treeShaking: true,
		color: true,
		plugins: [
			sveltePlugin({ compilerOptions: { dev: !isProd, css: 'external' } }),
			// @ts-ignore
			NodeResolve.default({ extensions: ['.js', '.svelte'] }),
		],
	};

	return src('./src/index.js', { sourcemaps: !isProd })
		// @ts-ignore
		.pipe(gulpEsbuild(cfg))
		.pipe(dest(DIST_PATH, { sourcemaps: '.' }))
		.pipe(livereload());
}



export function watch (done) {
	if (isProd) return done();
	livereload.listen();
	gulpEsbuild = createGulpEsbuild({ incremental: true });
	gulp.watch('src/**/*.styl', css);
	gulp.watch('src/**/*.{js,svelte}', series(eslint, js));
	gulp.watch('src/*.html', htmls);
	gulp.watch('src/assets/**/*.*', assets);
}

export const lint = parallel(eslint);
export const build = series(cleanup, parallel(js, css, assets, htmls, eslint));
export default series(build, watch);
