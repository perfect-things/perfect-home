import {readable, writable, derived} from 'svelte/store';
import {EVENT, getFolderTitle, getSettings, saveSettings, getThumbs, saveThumbs,
	getDockedFolders, saveDockedFolders} from '../lib';


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
	rootFolder   : ROOT_ID,
};

export const currentFolder = writable(ROOT_ID);
export const currentFolderTitle = derived(currentFolder, ($currentFolder, set) => {
	getFolderTitle($currentFolder).then(set);
});

export const defaultOptions = readable(_options);
export const options = writable(_options);
export const items = writable([]);



getSettings().then(stored => {
	options.set(Object.assign({}, _options, stored));
	options.subscribe(saveSettings);
	EVENT.fire(EVENT.settings.loaded);
});




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
