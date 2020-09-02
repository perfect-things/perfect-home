const CUSTOM_CSS_TITLE = 'CustomCSS';
function injectCss (css, title = CUSTOM_CSS_TITLE) {
	let style = document.querySelector(`[title=${title}]`);
	if (style) style.remove();

	style = document.createElement('STYLE');
	style.title = title;
	style.innerText = css;
	document.head.appendChild(style);
}


function validateCustomCss (css = '') {
	const styl = Array.from(document.styleSheets).find(s => s.title === CUSTOM_CSS_TITLE);
	if (css.length < 3) return true;
	if (!styl.rules.length) return false;
	const lt = css.split('{').length;
	const gt = css.split('}').length;
	if (!lt || !gt || lt !== gt) return false;
	return true;
}


function getHost (url) {
	let _url;
	try { _url = new URL(url); }
	catch (e) {/*eslint no-empty: 0*/}
	return _url.host.replace(/^www\./, '');
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

function isIP (url) {
	const reg = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,7})?$/g;
	return reg.test(url);
}

function isLocalFile (url) {
	return url.startsWith('file://');
}


function getLetterThumbnail (item) {
	const bg = colorFromString(item.url.replace(/(^https?:\/\/)|(\/$)/g, ''));
	const color = isDark(bg) ? '#fffd' : '#000d';
	const style = `background-color: ${bg}; color: ${color};`;
	const host = getHost(item.url);
	let text = (host || ''), suf;
	if (isIP(text)) {
		suf = text;
		text = item.title;
	}
	else if (isLocalFile(item.url)) {
		suf = item.url
			.replace('file://', '')
			.split(/[/\\]/)
			.slice(-2)
			.join('/');
		text = item.title;
	}
	else {
		const ar = text.split(/[.:]/g);
		if (ar.length > 1) text = text.replace(ar[0] + '.', ar[0] + '\n');
		[text, suf] = text.split('\n');
	}
	return {style, text, suf};
}



function fuzzy (hay = '', s = '') {
	hay = hay.toLowerCase();
	let n = -1;
	for (let l of s) if (!~(n = hay.indexOf(l, n + 1))) return false;
	return true;
}


function emphasize (str, q) {
	if (!q) return str;
	let idx = 0;
	let low = str.toLowerCase();
	let stra = str.split('');
	q = q.toLowerCase();
	for (let l of q) {
		idx = low.indexOf(l, idx);
		let letter = stra[idx];
		if (letter) {
			stra.splice(idx, 1, `<b>${letter}</b>`);
			idx += 1;
		}
	}
	return stra.join('');
}



function animate (el, from, to, options = {}) {
	const dflt = {duration: 300, easing: 'ease-out', fill: 'forwards'};
	const opts = Object.assign({}, dflt, options);

	return new Promise(resolve => {
		const anim = el.animate([from, to], opts);
		anim.oncancel = resolve;
		anim.onfinish = resolve;
	});
}


function getFavicon (url) {
	const favIconService = 'https://www.google.com/s2/favicons?domain=';
	let urlObj;
	try { urlObj = new URL(url); }
	catch {}
	if (!urlObj || !urlObj.host) return '';
	return favIconService + urlObj.host;
}


function clone (obj) {
	return JSON.parse(JSON.stringify(obj));
}



function copyToClipboard (text) {
	close();
	const inp = document.createElement('INPUT');
	inp.value = text;
	inp.style = 'position: fixed; left: -1000px; top: -1000px;';
	document.body.appendChild(inp);
	inp.select();
	inp.setSelectionRange(0, 99999); // For mobile devices
	document.execCommand('copy');
	setTimeout(() => inp.remove());

}


function flattenTree (list = []) {
	const flatList = [];
	for (let i = 0; i < list.length; i++) {
		const bookmark = list[i];
		if (bookmark.children) {
			const children = flattenTree(bookmark.children);
			flatList.push(...children);
			bookmark.type = 'folder';
		}
		else bookmark.type = 'bookmark';
		flatList.push(bookmark);
	}
	return flatList;
}

function isFirefox () {
	return typeof browser !== 'undefined';
}

function processSubTree (tree) {
	if (!tree || !tree.length) return [];
	return tree[0].children.map(ch => {
		if (!ch.type) {
			if (ch.children) ch.type = 'folder';
			else ch.type = 'bookmark';
		}
		if (ch.url && ch.url.startsWith('about:reader')) {
			ch.url = ch.url.replace('about:reader?url=', '');
			ch.url = decodeURIComponent(ch.url);
		}
		return ch;
	});
}

function isImage (url) {
	if (!url) return false;
	const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'];
	const ext = url.split('.').pop();
	return imageExtensions.includes(ext);
}

export {
	injectCss,
	validateCustomCss,
	getLetterThumbnail,
	fuzzy,
	emphasize,
	animate,
	getFavicon,
	clone,
	copyToClipboard,
	flattenTree,
	isFirefox,
	processSubTree,
	isImage,
};
