import {readable, writable, derived, get} from 'svelte/store';
import {EVENT} from './event';
import {getFaviconFromGoogle} from './google';
import {getThemes, getThemeIcon, getThemeCSS} from './github';
import {getFolderTitle, getThumbs, saveThumbs,
	getDockedFolders, saveDockedFolders} from './browser';

const ROOT_ID = 'menu________'; // = Bookmarks Menu
const _options = {
	gridMaxWidth : 1000,
	iconWidth    : 150,
	iconHeight   : 140,
	gridGap      : 30,
	pageColor    : '#eeeeee',
	pageBg       : '#333333',
	showLabels   : true,
	css          : '',
	theme        : '',
	themeCSS     : '',
	rootFolder   : ROOT_ID,
	allowGH      : false,
	allowGoogle  : false,
};

export const currentFolder = writable(ROOT_ID);
export const currentFolderTitle = derived(currentFolder, ($currentFolder, set) => {
	getFolderTitle($currentFolder).then(set);
});

export const defaultOptions = readable(_options);
export const options = writable(_options);
export const items = writable([]);


export const thumbs = writable({});
getThumbs().then(_thumbs => {
	if (_thumbs) thumbs.set(_thumbs);
	thumbs.subscribe(saveThumbs);
});


export const dockedFolders = writable([]);
getDockedFolders().then(folders => {
	if (folders) dockedFolders.set(folders);
	dockedFolders.subscribe(saveDockedFolders);
	EVENT.fire(EVENT.dockedFolders.loaded);
});


export const itemsLoaded = writable(false);
// when dragging links - temporarily prevent them from working
export const wasSorted = writable(false);



export function getFavicon (url) {
	if (!get(options).allowGoogle) return '';
	return getFaviconFromGoogle(url);
}



/*** THEMES ***************************************************************************************/

export const themeNames = writable([]);
export const themeIcons = writable([]);

function themesStore () {
	const { subscribe, set } = writable({});

	function load () {
		if (get(themeNames).length) return;
		if (!get(options).allowGH) return Promise.resolve({});

		return getThemes().then(thms => {
			if (thms) {
				set(thms);
				themeNames.set(Object.keys(thms));
			}
			apply();
		});
	}

	function apply () {
		const $options = get(options);
		const $themes = get(themes);
		const theme = Object.keys($themes).length && $options.theme && $themes[$options.theme];
		if (theme) {
			themeIcons.set(theme.icons);
			if (!get(options).allowGH) return;
			getThemeCSS(theme.css)
				.then(css => {
					$options.themeCSS = ('' + css).replace(/[\n\t]/g, '');
					options.set($options);
				});
		}
		else {
			themeIcons.set([]);
			$options.themeCSS = '';
			options.set($options);
		}
	}

	function getIcon (url) {
		if (!get(options).allowGH) return Promise.resolve({});
		return getThemeIcon(url);
	}

	return {
		subscribe,
		load,
		apply,
		getIcon,
		reset: () => set(0)
	};
}

export const themes = themesStore();
