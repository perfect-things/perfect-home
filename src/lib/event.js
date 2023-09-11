import { on, off, fire } from './pubsub';
export const EVENT = {
	on,
	off,
	fire,

	bookmark: {
		added: 'bookmark-added',
		moved: 'bookmark-moved',
		removed: 'bookmark-removed',
		edit: 'bookmark-edit',
		delete: 'bookmark-delete',
		saved: 'bookmark-saved',
		deleteThumb: 'bookmark-thumb-del',
		clearThumb: 'bookmark-thumb-clear',
		changeThumb: 'bookmark-thumb-change',
		thumbDropped: 'bookmark-thumb-dropped',
	},

	dockedFolders: {
		loaded: 'docked-folders-loaded',
		changed: 'docked-folders-changed',
	},

	document: {
		clicked: 'document-clicked',
		localLink: 'opening-local-link',
	},

	iconPicker: {
		open: 'open-icon-picker',
		picked: 'icon-picker-picked',
	},

	search: {
		toggle: 'search-toggle',
		open: 'search-open',
	},

	settings: {
		loaded: 'settings-loaded',
		imported: 'settings-imported',
	},

};
