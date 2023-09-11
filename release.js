#!/usr/bin/env node

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import semver from 'semver';
import ora from 'ora';
import chalk from 'chalk';
import indent from 'detect-indent';
import inquirer from 'inquirer';
import open from 'open';
import Git from 'simple-git';


const git = Git();
const cwd = process.cwd();

const manifests = ['package.json', 'src/manifest.json'];
const addonUrl = 'https://addons.mozilla.org/en-US/developers/addon/perfect-home/versions';
const chromeStoreDash = 'https://chrome.google.com/webstore/devconsole';
const dryrun = false;


const faker = () => new Promise(resolve => setTimeout(resolve, 200));

function run (cmd) {
	if (dryrun) return faker();
	return new Promise((resolve, reject) => {
		exec(cmd, (err, out) => (err ? reject(err) : resolve(out)));
	});
}

function getJson (_path) {
	try {
		const file = fs.readFileSync(_path, 'utf8');
		const json = JSON.parse(file);
		return json || {};
	}
	catch {
		return {};
	}
}


function getVersion (manifest) {
	const pkgPath = path.join(cwd, manifest || manifests[0]);
	const pkg = getJson(pkgPath);
	const current = pkg.version || '0.0.0';

	return {
		name: pkg.name,
		current: current,
		nextMajor: semver.inc(current, 'major'),
		nextMinor: semver.inc(current, 'minor'),
		nextPatch: semver.inc(current, 'patch')
	};
}


function bump (manifest, newVersion) {
	const pkgPath = path.join(cwd, manifest);
	const pkg = getJson(pkgPath);
	const usedIndent = indent(fs.readFileSync(pkgPath, 'utf8')).indent || '  ';
	pkg.version = newVersion;
	if (!dryrun) fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, usedIndent) + '\n');
}


function commit (version) {
	if (dryrun) return faker();
	return new Promise((resolve, reject) => {
		git
			.add('./*')
			.commit('Release v' + version)
			.push(['origin', 'master'], err => {
				if (err) reject(err);
				else resolve({ version });
			});
	});
}


function release () {
	const app = getVersion();
	let spinner;
	console.log('\n**************************************');
	console.log('*                                    *');
	console.log(`*      Releasing ${chalk.cyan(app.name)}        *`);
	console.log('*                                    *');
	console.log('**************************************\n');
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'version',
				message: 'Bump version to:',
				default: 1,
				choices: [
					{ value: app.current, name: 'current (' + app.current + ')' },
					{ value: app.nextPatch, name: 'patch   (' + app.nextPatch + ')' },
					{ value: app.nextMinor, name: 'minor   (' + app.nextMinor + ')' },
					{ value: app.nextMajor, name: 'major   (' + app.nextMajor + ')' },
					new inquirer.Separator(),
					{ value: 'custom', name: 'custom...' },
				]
			},
			{
				type: 'input',
				name: 'version',
				message: 'Enter the new version number:',
				default: app.current,
				when: answers => answers.version === 'custom',
				filter: semver.clean,
				validate: answer => semver.valid(answer) ? true : 'That\'s not a valid version number',
			}
		])
		.then(({ version }) => {
			app.version = version;
			spinner = ora('').start();
			// update package & manifest
			manifests.forEach(m => {
				spinner.text = `Updating ${m}...`;
				bump(m, version);
				spinner.text = `Updated ${chalk.cyan(m)} to ${chalk.cyan(version)}`;
				spinner.succeed();
			});
			spinner.text = 'Committing to GitHub...';
			spinner.start();
			return commit(version);              // commit code changes to  github
		})
		.then(() => {
			spinner.text = `Update ${chalk.cyan('pushed')} to Github.`;
			spinner.succeed();

			spinner.text = 'Building a ' + chalk.cyan('production') + ' version.';
			spinner.start();
			return run('gulp build --prod');
		})
		.then(() => {
			spinner.text = 'Built a ' + chalk.cyan('production') + ' version.';
			spinner.succeed();

			spinner.text = 'Packing extensions...';
			spinner.start();

			const cmd = `rm -rf ~/Desktop/${app.name} && ` +
				`mkdir ~/Desktop/${app.name} && ` +
				`cp -R dist/ ~/Desktop/${app.name} && ` +
				`cp LICENSE ~/Desktop/${app.name} && ` +
				`rm -f ~/Desktop/${app.name}/manifest-chrome.json && ` +

				// zip for firefox
				`7z a ~/Desktop/${app.name}-firefox.zip ~/Desktop/${app.name}/* && ` +

				// zip for chrome
				`rm -f ~/Desktop/${app.name}/manifest.json && ` +
				`cp dist/manifest-chrome.json ~/Desktop/${app.name}/manifest.json && ` +
				`7z a ~/Desktop/${app.name}-chrome.zip ~/Desktop/${app.name}/ && ` +

				`rm -rf ~/Desktop/${app.name}`;

			return run(cmd).catch(() => {});
		})
		.then(() => {
			spinner.text = 'Extensions packed.';
			spinner.succeed();

			spinner.text = 'Zipping source for Firefox submission.';
			spinner.start();

			const cmd = `rm -rf ~/Desktop/${app.name} && ` +
				`mkdir ~/Desktop/${app.name} && ` +
				`cp -R src/ ~/Desktop/${app.name}/src/ && ` +
				`cp LICENSE ~/Desktop/${app.name} && ` +
				`cp package.json ~/Desktop/${app.name} && ` +
				`cp gulpfile.js ~/Desktop/${app.name} && ` +
				`cp .editorconfig ~/Desktop/${app.name} && ` +
				`cp .eslintrc ~/Desktop/${app.name} && ` +
				`7z a ~/Desktop/${app.name}-source.zip ~/Desktop/${app.name}/ && ` +
				`rm -rf ~/Desktop/${app.name}`;

			return run(cmd).catch(() => {});
		})
		.then(() => {
			spinner.text = 'Source zipped to ' + chalk.cyan('Desktop') + '!';
			spinner.succeed();

			console.log(chalk.cyan('All done!'));
			if (!dryrun) open(addonUrl);
			if (!dryrun) open(chromeStoreDash);
			process.exit(0);
		})
		.catch(e => {
			spinner.text = '' + e;
			spinner.fail();
		});
}


release();
