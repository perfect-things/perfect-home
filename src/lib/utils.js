
const CUSTOM_CSS_ID = 'CustomCSS';
function injectCss (css, id = CUSTOM_CSS_ID) {
	let style = document.getElementById(id);
	// let style = document.querySelector(`[title=${id}]`);
	if (style) style.remove();
	css = css.replace(/\n/g, ' ').replace(/<br>/g, ' ');
	if (!css) return;
	style = document.createElement('STYLE');
	style.id = id;
	style.innerText = css;
	document.head.appendChild(style);
}


/**
 * Workaround for how firefox handles <style> elements:
 *   - if <style> element has only `title` - the css will not be applied
 *   - if styleSheet has only `id` - it will not be found in `document.styleSheets`
 * this temporarily changes id to title, and removes the title after the validation
 * @param {string} css
 */
function validateCustomCss (css = '') {
	const styleElem = document.getElementById(CUSTOM_CSS_ID);
	if (!styleElem) return true;
	styleElem.title = styleElem.id;
	const styl = Array.from(document.styleSheets).find(s => s.title === CUSTOM_CSS_ID);
	if (css.length < 3) return true;
	if (!styl.rules.length) return false;
	const lt = css.split('{').length;
	const gt = css.split('}').length;
	styleElem.id = styleElem.title;
	styleElem.removeAttribute('title');
	if (!lt || !gt || lt !== gt) return false;
	return true;
}


function isIP (url) {
	const reg = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,7})?$/g;
	return reg.test(url);
}


function getHost (url) {
	let _url;
	try { _url = new URL(url); }
	catch (e) {/*eslint no-empty: 0*/}
	_url = _url.host.replace(/^www\./, '');

	if (isIP(_url)) return _url;

	const chunks = _url.split('.');
	return chunks.slice(-2).join('.');
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

function getLetterThumbnailStyle (item) {
	const bg = colorFromString(item.url.replace(/(^https?:\/\/)|(\/$)/g, ''));
	const color = isDark(bg) ? '#fffd' : '#000d';
	return `background-color: ${bg}; color: ${color};`;
}


function fuzzy (hay = '', s = '') {
	hay = hay.toLowerCase();
	s = s.toLowerCase();
	let n = -1;
	for (const l of s) if (!~(n = hay.indexOf(l, n + 1))) return false;
	return true;
}


function emphasize (str, q) {
	if (!q) return str;
	str = '' + str;
	let idx = 0;
	const low = str.toLowerCase();

	// string includes the whole query block
	if (low.includes(q)) return str.replace(new RegExp(`(${q})`, 'ig'), '<b>$1</b>');

	// string includes the scattered query
	const stra = str.split('');
	q = q.toLowerCase();
	for (const l of q) {
		idx = low.indexOf(l, idx);
		const letter = stra[idx];
		if (letter) {
			stra.splice(idx, 1, `<b>${letter}</b>`);
			idx += 1;
		}
	}
	return stra.join('');
}



function animate (el, from, to, _options = {}) {
	const dflt = { duration: 300, easing: 'ease-out', fill: 'forwards' };
	const opts = Object.assign({}, dflt, _options);

	return new Promise(resolve => {
		const anim = el.animate([from, to], opts);
		anim.oncancel = resolve;
		anim.onfinish = resolve;
	});
}



function clone (obj) {
	return JSON.parse(JSON.stringify(obj));
}

function objectsMoreLessTheSame (obj1, obj2) {
	return JSON.stringify(obj1) === JSON.stringify(obj2);
}



function copyToClipboard (text) {
	const inp = document.createElement('INPUT');
	inp.value = text;
	inp.style = 'position: fixed; left: -1000px; top: -1000px;';
	document.body.appendChild(inp);
	try {
		inp.select();
		inp.setSelectionRange(0, 99999); // For mobile devices
		document.execCommand('copy');
	}
	catch (e) {
		console.error(e);
	}
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


function cropText (text, lim = 20) {
	if (text.length < lim) return text;
	return text.substr(0, lim - 3) + '...';
}

export {
	injectCss,
	validateCustomCss,
	getLetterThumbnailStyle,
	getHost,
	fuzzy,
	emphasize,
	animate,
	clone,
	cropText,
	objectsMoreLessTheSame,
	copyToClipboard,
	flattenTree,
	processSubTree,
	isImage,
};
