/* global browser */


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



const getSettings = () => browser.storage.local.get('settings');

const getSubTree = id => browser.bookmarks.getSubTree(id);

const getBookmark = id => browser.bookmarks.get(id);



export {
	getSettings,
	getSubTree,
	getBookmark,
	colorFromString,
	isDark,
};
