const GH_TREE_URL = 'https://api.github.com/repos/perfect-things/perfect-home-themes/git/trees/master?recursive=1';
const GH_IMAGE_BASE_URL = 'https://raw.githubusercontent.com/perfect-things/perfect-home-themes/master/';

function parseThemes (resp) {
	if (!resp || !resp.tree) return [];
	const themeNames = resp.tree
		.filter(item => item.type === 'tree')
		.map(item => item.path.replace('theme-', ''));

	const thumbs = resp.tree.filter(item => item.type === 'blob' && item.path.endsWith('.png'));
	const cssFiles = resp.tree.filter(item => item.type === 'blob' && item.path.endsWith('.css'));

	const themes = {};
	themeNames.forEach(themeName => {
		const thm = 'theme-' + themeName;
		themes[themeName] = { icons: [], css: '' };
		themes[themeName].icons = thumbs
			.filter(item => item.path.startsWith(thm))
			.map(({path, url}) => {
				const name = path.replace(thm + '/', '').replace('.png', '');
				const imgUrl = `${GH_IMAGE_BASE_URL}${path}`;
				return { name, url, path, imgUrl };
			})
			.filter(item => !item.name.startsWith('_'));

		themes[themeName].css = cssFiles
			.filter(item => item.path.startsWith(thm))
			.map(item => item.url)
			.pop() || '';
	});
	return themes;
}

export function getThemes () {
	return fetch(GH_TREE_URL)
		.then(res => res.json())
		.then(parseThemes)
		.catch(e => console.error(e));
}

export function getThemeCSS (url) {
	if (!url) return Promise.resolve('');
	return fetch(url)
		.then(resp => resp.json())
		.then(resp => resp && resp.content ? atob(resp.content || '') : '')
		.catch(() => {});
}


export function getThemeIcon (url) {
	if (!url) return Promise.resolve('');
	return fetch(url)
		.then(resp => resp.json())
		.then(resp => {
			const content = (resp && resp.content || '').replace(/\n/g, '');
			return 'data:image/png;base64,' + content;
		})
		.catch(() => {});
}
