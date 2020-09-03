import {readable, writable, derived, get} from 'svelte/store';
import {EVENT} from './event';
import {getThemes, getThemeCSS} from './github';
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
};

export const currentFolder = writable(ROOT_ID);
export const currentFolderTitle = derived(currentFolder, ($currentFolder, set) => {
	getFolderTitle($currentFolder).then(set);
});

export const defaultOptions = readable(_options);
export const options = writable(_options);
export const items = writable([]);

export const themeNames = writable([]);
export const themeIcons = writable([]);

function themesStore () {
	const { subscribe, set } = writable({});

	function apply () {
		const $options = get(options);
		const $themes = get(themes);
		if ($options.theme && $themes[$options.theme]) {
			themeIcons.set($themes[$options.theme].icons);
			getThemeCSS($themes[$options.theme].css)
				.then(css => {
					$options.themeCSS = ('' + css).replace(/[\n\t]/g, '');
					options.set($options);
				});
		}
	}
	return {
		subscribe,
		load: () => {
			if (get(themeNames).length) return;
			return getThemes().then(thms => {
				set(thms);
				themeNames.set(Object.keys(thms));
				apply();
			});
		},
		apply,
		reset: () => set(0)
	};
}

export const themes = themesStore();



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
