
function injectCss (css) {
	let style = document.querySelector('#CustomStyle');
	if (style) style.remove();

	style = document.createElement('STYLE');
	style.id = 'CustomStyle';
	style.innerText = css;
	document.head.appendChild(style);
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


function getLetterThumbnail (item) {
	const bg = colorFromString(item.url.replace(/(^https?:\/\/)|(\/$)/g, ''));
	const color = isDark(bg) ? '#ccc' : '#333';
	const style = `background-color: ${bg}; color: ${color};`;

	const host = getHost(item.url);
	const title = item.title || host || '';
	const letter = title.replace(/^\W+|\W+$/gi, '')[0] || '';
	const innerText = letter.toUpperCase();
	return {style, innerText};
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

	return new Promise (resolve => {
		const anim = el.animate([from, to], opts);
		anim.oncancel = resolve;
		anim.onfinish = resolve;
	});
}


function getFavicon (url) {
	const favIconService = 'https://www.google.com/s2/favicons?domain=';
	// const fallback = 'https://besticon-demo.herokuapp.com/icon?size=64&url=';
	let urlObj;
	try { urlObj = new URL(url); }
	catch (e) {/**/}
	return favIconService + (urlObj.host || '');
}


function clone (obj) {
	return JSON.parse(JSON.stringify(obj));
}

export {
	injectCss,
	getLetterThumbnail,
	fuzzy,
	emphasize,
	animate,
	getFavicon,
	clone,
};
