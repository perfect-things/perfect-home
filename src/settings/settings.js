/* global browser, Form, Toast */

let form;
const defaults = {
	gridwidth: 968,
	gridgap: 74,
	showlabels: true,
	iconsize: 74,
	pagebg: '#333',
	pagecolor: '#fff',
	rootfolder: 'Bookmarks Menu',
	css: '',
};


let storedSettings = null;
const $ = s => document.querySelector(s);
const notify = () => new Toast('Settings saved', 'info');
const save = settings => browser.storage.local.set({ settings }).then(notify);


function updateInputValue (things) {
	if (things.pagecolor) document.body.style.color = things.pagecolor;
	if (things.pagebg) document.body.style.background = things.pagebg;

	Object.keys(things).forEach(name => {
		const tooltip = $(`.${name}-tooltip`);
		if (tooltip) tooltip.innerText = things[name];
	});
}

function onSubmit (e) {
	e.preventDefault();
	const newSettings = form.get();
	if (!storedSettings || storedSettings.mode === newSettings.mode) save(newSettings);
	else clearCache().then(() => save(newSettings));
	storedSettings = newSettings;
}

function reset (persist) {
	defaults.rootfolder = form.get().rootfolder;	// don't reset this!
	form.set(defaults);
	updateInputValue(defaults);
	if (persist === true) return save(defaults);
	else return Promise.resolve();
}



function clearCache () {
	return browser.storage.local.clear();
}


function initSettings () {
	browser.storage.local.get('settings').then(store => {
		storedSettings = store.settings || {};
		const merged = Object.assign({}, defaults, storedSettings);
		form.set(merged);
		updateInputValue(merged);
	});

	const folderName = $('#folderName');
	browser.bookmarks.search({ title: '' })
		.then(items => {
			const options = items
				.filter(item => item.type !== 'bookmark')
				.map(item => `<option value="${item.id}">${item.title}</option>`);
			folderName.innerHTML = options;
		});
}


function init () {
	const formEl = $('#settingsForm');
	form = new Form(formEl);
	formEl.addEventListener('submit', onSubmit);

	document.querySelectorAll('input').forEach(input => {
		input.addEventListener('input', e => {
			const inp = {};
			inp[e.target.name] = e.target.value;
			updateInputValue(inp);
		});
	});


	$('.btn-reset').addEventListener('click', reset);
	$('.btn-clear').addEventListener('click', () => clearCache().then(() => reset(true)));

	updateInputValue(defaults);
	initSettings();
}


init();
