/* global browser */


const getSettings = async () => browser.storage.local.get('settings').then(res => res && res.settings);
const saveSettings = async (settings) => browser.storage.local.set({ settings });

const getFolderTitle = async id => browser.bookmarks.get(id).then(res => res[0].title);

const getSubTree = async (id) => browser.bookmarks.getSubTree(id);

const getBookmark = async (id) => browser.bookmarks.get(id).then(res => res.length && res[0]);

const delBookmark = async (id) => browser.bookmarks.remove(id);

const moveBookmark = async (id, {parentId, index}) => browser.bookmarks.move(id, {parentId, index});

const getAllItems = async () => browser.bookmarks.search({ title: '' });

const clearCache = async () => browser.storage.local.clear();


const getThumbs = async () => browser.storage.local.get('thumbs').then(res => res && res.thumbs);
const saveThumbs = async (thumbs) => browser.storage.local.set({ thumbs });

const getDockedFolders = async () => browser.storage.local.get('dockedFolders').then(res => res && res.dockedFolders);
const saveDockedFolders = async (dockedFolders) => browser.storage.local.set({ dockedFolders });


export {
	getSettings,
	saveSettings,

	getFolderTitle,
	getSubTree,
	getBookmark,
	delBookmark,
	moveBookmark,
	getAllItems,
	clearCache,

	getThumbs,
	saveThumbs,
	getDockedFolders,
	saveDockedFolders,
};
