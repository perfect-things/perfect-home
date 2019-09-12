/* global browser Sortable */

const ROOT_FOLDER = { title: 'Bookmarks Menu', id: 'menu________' };

const colorHash = new window.ColorHash();
let btnBack, titleEl, bookmarksEl, currentFolderId, settings;
const defaults = {
	gridwidth: 968,
	gridgap: 74,
	iconsize: 74,
	pagebg: '#333',
	pagecolor: '#fff',
	rootfolder: ROOT_FOLDER.id,
	css: '',
};


function isDark (color) {
	const hex = color.replace('#', '');
	const c_r = parseInt(hex.substr(0, 2), 16);
	const c_g = parseInt(hex.substr(2, 2), 16);
	const c_b = parseInt(hex.substr(4, 2), 16);
	const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
	return brightness < 80;
}


function printInstructions () {
	titleEl.innerHTML = `Create a <b>${settings.rootfolder}</b> folder in your bookmarks, to see links here or edit settings.`;
}


function getItemThumb (item) {
	const el = document.querySelector(`.item-${item.id} .item-thumb`);
	if (!el) return;

	if (item.type === 'bookmark') {
		el.classList.add('letter-thumb');
		const bg = colorHash.hex(item.url.replace(/(^https?:\/\/)|(\/$)/g, ''));
		el.style.backgroundColor = bg;
		el.style.color = isDark(bg) ? '#ccc' : '#333';
		el.innerText = item.title.substr(0, 1).toUpperCase();
	}
	else {
		el.classList.add('folder-thumb');
		const icon = '../img/folder.svg';
		if (el.style) {
			if (item.type === 'folder') el.style.maskImage = `url(${icon})`;
			else el.style.backgroundImage = `url(${icon})`;
		}
	}
	return item;
}


// type, title, url
function getItemHtml (item) {
	if (item.type === 'separator') return '<div class="item separator"></div>';
	if (item.url) {
		if (item.url.indexOf('http') > 0) item.url = item.url.substr(item.url.indexOf('http'));
		item.url = decodeURIComponent(item.url);
	}
	return `<a href="${item.url || item.id}" class="item item-${item.type} item-${item.id}">
		<span class="item-thumb"></span>
		<span class="item-title" title="${item.title}">${item.title}</span>
	</a>`;
}


function printBookmarks (node = {}) {
	btnBack.style.display = (node.id === ROOT_FOLDER.id ? 'none' : 'block');
	titleEl.innerText = node.title;
	bookmarksEl.innerHTML = node.children.map(getItemHtml).join('');
	window.ellipses('.item-title');
	return node.children;
}


function findSpeedDial (id) {
	return browser.bookmarks
		.get(id)
		.then(res => res.length && res[0])
		.then(res => {
			if (!res) return;
			ROOT_FOLDER.id = res.id;
			ROOT_FOLDER.title = res.title;
			return res.id;
		});
}

/**
 * Push new state to history
 */
function logState (id) {
	if (history.state && history.state.id && history.state.id === id) return;
	const fn = (id === ROOT_FOLDER.id) ? 'replaceState' : 'pushState';
	window.history[fn]({ id }, document.title, '');
}


function readFolder (folderId, skipState = false) {
	if (!folderId) return printInstructions();

	currentFolderId = folderId;
	if (skipState !== true) logState(folderId);
	return browser.bookmarks
		.getSubTree(folderId)
		.then(tree => tree[0])
		.then(printBookmarks)
		.then(items => items.map(getItemThumb));
}


function goBack () {
	if (!currentFolderId || currentFolderId === ROOT_FOLDER.id) return;
	history.back();
}


function onClick (e) {
	const folder = e.target.closest('.item-folder');
	if (folder) {
		e.preventDefault();
		readFolder(folder.getAttribute('href'));
	}
}


function injectCss (css) {
	const style = document.createElement('STYLE');
	style.innerHTML = css;
	document.head.appendChild(style);
}


function init () {
	btnBack = document.querySelector('.btn-back');
	titleEl = document.querySelector('.title');
	bookmarksEl = document.querySelector('.bookmarks');

	document.addEventListener('click', onClick);
	btnBack.addEventListener('click', goBack);

	browser.storage.local.get('settings').then(store => {
		settings = Object.assign({}, defaults, store.settings || {});

		document.documentElement.style.setProperty('--color', settings.pagecolor);
		document.documentElement.style.setProperty('--bg', settings.pagebg);
		document.documentElement.style.setProperty('--icon-size', settings.iconsize + 'px');
		document.documentElement.style.setProperty('--grid-width', settings.gridwidth + 'px');
		document.documentElement.style.setProperty('--grid-gap', settings.gridgap + 'px');

		findSpeedDial(settings.rootfolder)
			.then(id => {
				if (!id && history.state && history.state.id) id = history.state.id;
				return readFolder(id);
			})
			.then(() => {
				new Sortable(document.querySelector('.bookmarks'), {
					animation: 150,
					onSort: ev => {
						console.log(ev);
					}
				});
			});

		if (settings.css) injectCss(settings.css);

	});

	window.onpopstate = e => {
		if (e.state && e.state.id) readFolder(e.state.id, true);
	};
}
init();
