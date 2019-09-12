/*global browser */
import { writable, derived } from 'svelte/store';


const ROOT_FOLDER = 'menu________';

const setFolderTitle = (id, set) => browser.bookmarks.get(id).then(res => set(res[0].title));


export const options = writable({
	gridWidth  : 968,
	gridGap    : 74,
	iconSize   : 74,
	pageColor  : '#fff',
	pageBg     : '#333',
	css        : '',
	rootFolder : ROOT_FOLDER,
});
export const rootFolderTitle = derived(options, ($options, set) => setFolderTitle($options.rootFolder, set), 'Bookmarks Menu');

export const currentFolder = writable(ROOT_FOLDER);
export const currentFolderTitle = derived(currentFolder, setFolderTitle, 'Bookmarks Menu');


export const items = writable([]);
