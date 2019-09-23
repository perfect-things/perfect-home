import {writable} from 'svelte/store';


const ROOT_ID = 'menu________'; // = Bookmarks Menu

export const options = writable({
	columns    : 6,
	iconWidth  : 170,
	iconHeight : 160,
	gridGap    : 35,
	pageColor  : '#eeeeee',
	pageBg     : '#333333',
	css        : '',
	rootFolder : ROOT_ID,
});
export const rootFolderTitle = writable('');

export const currentFolder = writable(ROOT_ID);
export const currentFolderTitle = writable('');

export const itemsLoaded = writable(false);
export const items = writable([]);

export const thumbs = writable({});
