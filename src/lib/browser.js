/* global browser */


const getSettings = async () => browser.storage.local.get('settings').then(res => res && res.settings);
const saveSettings = async (settings) => browser.storage.local.set({ settings });

const getFolderTitle = async id => browser.bookmarks.get(id).then(res => res[0].title);

const getSubTree = async (id) => browser.bookmarks.getSubTree(id);

const getBookmark = async (id) => browser.bookmarks.get(id).then(res => res.length && res[0]);

const delBookmark = async (id) => browser.bookmarks.remove(id);

const updateIndexes = async (id, index) => browser.bookmarks.move(id, {index});

const getAllItems = async () => browser.bookmarks.search({ title: '' });

const clearCache = async () => browser.storage.local.clear();


const getThumbs = async () => browser.storage.local.get('thumbs').then(res => res && res.thumbs);
const saveThumbs = async (thumbs) => browser.storage.local.set({ thumbs });


export {
	getSettings,
	saveSettings,

	getFolderTitle,
	getSubTree,
	getBookmark,
	delBookmark,
	updateIndexes,
	getAllItems,
	clearCache,

	getThumbs,
	saveThumbs,
};
