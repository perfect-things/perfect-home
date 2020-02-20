import {on, off, fire} from './pubsub';
export const EVENT = {
	on,
	off,
	fire,

	document: {
		clicked: 'document-clicked',
		localLink: 'opening-local-link'
	},

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
	settings: {
		loaded: 'settings-loaded',
		imported: 'settings-imported',
	},
	dockedFolders: {
		loaded: 'docked-folders-loaded',
		changed: 'docked-folders-changed',
	},



};
