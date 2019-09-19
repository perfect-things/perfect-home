/* global browser */


function injectCss (css) {
	const style = document.createElement('STYLE');
	style.id = 'CustomStyle';
	style.innerHTML = css;
	document.head.appendChild(style);
}



// https://stackoverflow.com/a/16348977/424446
function colorFromString (str) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	let colour = '#';
	for (let i = 0; i < 3; i++) {
		const value = (hash >> (i * 8)) & 0xFF;
		colour += ('00' + value.toString(16)).substr(-2);
	}
	return colour;
}


function isDark (color) {
	const hex = color.replace('#', '');
	const c_r = parseInt(hex.substr(0, 2), 16);
	const c_g = parseInt(hex.substr(2, 2), 16);
	const c_b = parseInt(hex.substr(4, 2), 16);
	const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
	return brightness < 80;
}



function fuzzy (hay = '', s = '') {
	hay = hay.toLowerCase();
	let n = -1;
	for (let l of s) if (!~(n = hay.indexOf(l, n + 1))) return false;
	return true;
}


function emphasize (str, q) {
	let idx = 0;
	let low = str.toLowerCase();
	let stra = str.split('');
	q = q.toLowerCase();
	for (let l of q) {
		idx = low.indexOf(l, idx);
		let letter = stra[idx];
		if (letter) stra.splice(idx, 1, `<b>${letter}</b>`);
	}
	return stra.join('');
}



const getSettings = async () => browser.storage.local.get('settings');
const saveSettings = async (settings) => browser.storage.local.set({ settings });

const getFolderTitle = async id => browser.bookmarks.get(id).then(res => res[0].title);

const getSubTree = async (id) => browser.bookmarks.getSubTree(id);

const getBookmark = async (id) => browser.bookmarks.get(id);

const updateIndexes = async (id, index) => browser.bookmarks.move(id, {index});

const getAllItems = async () => browser.bookmarks.search({ title: '' });

const clearCache = async () => browser.storage.local.clear();


export {
	injectCss,
	colorFromString,
	isDark,
	fuzzy,
	emphasize,

	getSettings,
	saveSettings,

	getFolderTitle,
	getSubTree,
	getBookmark,
	updateIndexes,
	getAllItems,
	clearCache,
};
