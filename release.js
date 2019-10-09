#!/usr/bin/env node

const {exec} = require('child_process');
const fs = require('fs');
const path = require('path');
const SemVer = require('semver');
const ora = require('ora');
const chalk = require('chalk');
const indent = require('detect-indent');
const inquirer = require('inquirer');
const open = require('open');
const git = require('simple-git')();
const config = require('./config-prod.json');
const cwd = process.cwd();

const manifests = [ 'package.json', 'src/manifest.json' ];
const addonUrl = 'https://addons.mozilla.org/en-US/developers/addon/perfect-home/edit';
const dryrun = false;
const faker = () => new Promise(resolve => setTimeout(resolve, 2000));

function run (cmd) {
	if (dryrun) return faker();
	return new Promise((resolve, reject) => {
		exec(cmd, (err, out) => (err ? reject(err) : resolve(out)));
	});
}


function getVersion (manifest) {
	const pkgPath = path.join(cwd, manifest || manifests[0]);
	const pkg = require(pkgPath);
	const current = new SemVer(pkg.version || '0.0.0');

	return {
		name: pkg.name,
		current: current.version,
		nextMajor: SemVer.inc(current.version, 'major'),
		nextMinor: SemVer.inc(current.version, 'minor'),
		nextPatch: SemVer.inc(current.version, 'patch')
	};
}


function bump (manifest, newVersion) {
	const pkgPath = path.join(cwd, manifest);
	const pkg = require(pkgPath);
	const usedIndent = indent(fs.readFileSync(pkgPath, 'utf8')).indent || '  ';
	pkg.version = newVersion;
	if (!dryrun) fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, usedIndent) + '\n');
}


function commit (version, notes) {
	if (dryrun) return faker();
	return new Promise((resolve, reject) => {
		git
			.silent(true)
			.add('./*')
			.commit(notes || 'version bump')
			.push(['origin', 'master'], err => {
				if (err) reject(err);
				else resolve({version, notes});
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
			return commit(version, notes);              // commit code changes to  github
		})
		.then(() => {
			spinner.text = `Update ${chalk.cyan('committed')} to Github.`;
			spinner.succeed();

			spinner.text = 'Building a ' + chalk.cyan('production') + ' version.';
			spinner.start();
			return run('gulp build --prod');
		})
		.then(() => {
			spinner.text = 'Built a ' + chalk.cyan('production') + ' version.';
			spinner.succeed();


			spinner.text = 'Publishing addon to mozilla...';
			spinner.start();

			const signCmd = path.resolve('./', 'node_modules/.bin/web-ext') +
				' sign --channel=listed' +
				' --api-secret=' + config.apiSecret +
				' --api-key=' + config.apiKey;
			return run(signCmd).catch(() => {});
		})
		.then(() => {
			spinner.text = 'Signed & published!';
			spinner.succeed();

			console.log(chalk.cyan('All done!'));
			if (!dryrun) open(addonUrl);
		})
		.catch(e => {
			spinner.text = e;
			spinner.fail();
		});
}


release();
