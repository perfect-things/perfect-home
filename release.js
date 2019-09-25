#!/usr/bin/env node

const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');
const SemVer = require('semver');
const chalk = require('chalk');
const indent = require('detect-indent');
const inquirer = require('inquirer');
const open = require('open');
const git = require('simple-git')();
const config = require('./config-prod.json');
const cwd = process.cwd();

const manifests = [ 'package.json', 'src/manifest.json' ];


function getVersion (manifest) {
	let pkgPath = path.join(cwd, manifest || manifests[0]);
	const pkg = require(pkgPath);
	let current = new SemVer(pkg.version || '0.0.0');

	return {
		name: pkg.name,
		current: current.version,
		nextMajor: SemVer.inc(current.version, 'major'),
		nextMinor: SemVer.inc(current.version, 'minor'),
		nextPatch: SemVer.inc(current.version, 'patch')
	};
}


function bump (manifest, newVersion) {
	let pkgPath = path.join(cwd, manifest);
	const pkg = require(pkgPath);
	let usedIndent = indent(fs.readFileSync(pkgPath, 'utf8')).indent || '  ';
	pkg.version = newVersion;
	fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, usedIndent) + '\n');
	console.log(`Updated ${chalk.cyan(manifest)} to ${chalk.cyan(newVersion)}`);
}


function commit (version, notes) {
	return new Promise(resolve => {
		git
			.silent(true)
			.add('./*')
			.commit(notes || 'version bump')
			.push(['origin', 'master'], err => {
				if (err) return console.error(chalk.red(err));
				console.log(`Update ${chalk.cyan('committed')} to Github.`);
				resolve({version, notes});
			});
	});
}


function release () {
	const app = getVersion();
	console.log('\n**************************************');
	console.log('*                                    *');
	console.log(`*      Releasing ${chalk.cyan(app.name)}       *`);
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
					{ value: app.current,   name: 'current (' + app.current + ')' },
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
				filter: SemVer.clean,
				validate: answer => SemVer.valid(answer) ? true : 'That\'s not a valid version number',
			},
			{
				type: 'input',
				name: 'notes',
				message: 'Enter a release/commit comment:',
				default: prev => 'bump version to ' + prev.version
			}
		])
		.then(({version, notes}) => {
			manifests.forEach(m => bump(m, version));   // update package & manifest
			return commit(version, notes);              // commit code changes to  github
		})
		.then(res => {
			console.log('Building');
			execSync('gulp --prod');
			return res;
		})
		.then(res => {
			console.log('Publishing to mozilla');
			const signCmd = path.resolve('./', 'node_modules/.bin/web-ext') +
				' sign --channel=listed' +
				' --api-secret=' + config.apiSecret +
				' --api-key=' + config.apiKey;

			return execSync(signCmd).then(() => res);
		})
		.then(() => {
			console.log('Signed & published!');
			console.log(chalk.cyan('All done!'));
			const url = 'https://addons.mozilla.org/en-US/developers/addon/perfect-home/edit';
			open(url);
		})
		.catch(e => console.error(chalk.red(e)));
}


release();
