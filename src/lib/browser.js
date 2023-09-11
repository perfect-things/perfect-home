import browser from 'webextension-polyfill';
import { flattenTree, processSubTree } from './utils';

const isChrome = browser.extension &&
	browser.extension.getURL &&
	browser.extension.getURL('/') &&
	browser.extension.getURL('/').startsWith('chrome');

const getSettings = () => browser.storage.local.get('settings').then(res => res && res.settings);
const saveSettings = (settings) => browser.storage.local.set({ settings });

const getFolderTitle = id => browser.bookmarks.get(id).then(res => res[0].title).catch(() => {});

const getSubTree = (id) => browser.bookmarks.getSubTree(id).then(processSubTree).catch(() => {});

const getBookmark =	 (id) => browser.bookmarks.get(id).then(res => res.length && res[0]).catch(() => {});
const saveBookmark = (item) => browser.bookmarks.update(item.id, { title: item.title, url: item.url });
const deleteBookmark = (id) => browser.bookmarks.remove(id);
const createBookmark = (item) => browser.bookmarks.create(item);

const moveBookmark = (id, { parentId, index }) => browser.bookmarks.move(id, { parentId, index });

const getAllItems = () => browser.bookmarks.getTree().then(tree => {
	tree[0].title = tree[0].title || 'All Bookmarks';
	return flattenTree(tree);
});

const clearCache = () => browser.storage.local.clear();

const getThumbs = () => browser.storage.local.get('thumbs').then(res => res && res.thumbs);
const saveThumbs = (thumbs) => browser.storage.local.set({ thumbs });

const getDockedFolders = () => browser.storage.local.get('dockedFolders').then(res => res && res.dockedFolders);
const saveDockedFolders = (dockedFolders) => browser.storage.local.set({ dockedFolders });

const newtab = (cfg) => browser.tabs.create(cfg);
const newwindow = (cfg) => browser.windows.create(cfg);

export {
	isChrome,
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
