import {writable, derived} from 'svelte/store';
import {getBookmark} from '../lib';


const ROOT_ID = 'menu________';
const ROOT_TITLE = '';

function setFolderTitle (id, set) {
	return getBookmark(id).then(res => set(res[0].title));
}


export const options = writable({
	columns    : 6,
	iconWidth  : 160,
	iconHeight : 140,
	gridGap    : 20,
	pageColor  : '#fff',
	pageBg     : '#333',
	css        : '',
	rootFolder : ROOT_ID,
});
export const rootFolderTitle = derived(options, ($options, set) => setFolderTitle($options.rootFolder, set), ROOT_TITLE);


export const currentFolder = writable(ROOT_ID);
export const currentFolderTitle = derived(currentFolder, setFolderTitle, ROOT_TITLE);



export const itemsLoaded = writable(false);
export const items = writable([]);
