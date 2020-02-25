import browser from 'webextension-polyfill';
import {isFirefox, flattenTree} from './utils';

const getSettings = async () => browser.storage.local.get('settings').then(res => res && res.settings);
const saveSettings = async (settings) => browser.storage.local.set({ settings });

const getFolderTitle = async id => browser.bookmarks.get(id).then(res => res[0].title).catch(() => {});

const getSubTree = async (id) => browser.bookmarks.getSubTree(id).catch(() => {});

const getBookmark = async (id) => browser.bookmarks.get(id).then(res => res.length && res[0]).catch(() => {});
const saveBookmark = async (item) => browser.bookmarks.update(item.id, {title: item.title, url: item.url});
const deleteBookmark = async (id) => browser.bookmarks.remove(id);
const createBookmark = async (item) => browser.bookmarks.create(item);

const moveBookmark = async (id, {parentId, index}) => browser.bookmarks.move(id, {parentId, index});



const getAllItemsFirefox = async () => browser.bookmarks.search({ title: '' });
const getAllItemsChrome = async () => browser.bookmarks.getTree().then(tree => flattenTree(tree[0].children));
const getAllItems = async () => await (isFirefox() ? getAllItemsFirefox() : getAllItemsChrome());


const clearCache = async () => browser.storage.local.clear();

const getThumbs = async () => browser.storage.local.get('thumbs').then(res => res && res.thumbs);
const saveThumbs = async (thumbs) => browser.storage.local.set({ thumbs });

const getDockedFolders = async () => browser.storage.local.get('dockedFolders').then(res => res && res.dockedFolders);
const saveDockedFolders = async (dockedFolders) => browser.storage.local.set({ dockedFolders });

const newtab = async (cfg) => browser.tabs.create(cfg);
const newwindow = async (cfg) => browser.windows.create(cfg);

export {
	getSettings,
	saveSettings,

	getFolderTitle,
	getSubTree,
	getBookmark,
	saveBookmark,
	deleteBookmark,
	createBookmark,

	moveBookmark,
	getAllItems,
	clearCache,

	getThumbs,
	saveThumbs,
	getDockedFolders,
	saveDockedFolders,

	newtab,
	newwindow,
};
