export function getFaviconFromGoogle (url) {
	const favIconService = 'https://www.google.com/s2/favicons?domain=';
	let urlObj;
	try { urlObj = new URL(url); }
	catch {/**/}
	if (!urlObj || !urlObj.host) return '';
	return favIconService + urlObj.host;
}
