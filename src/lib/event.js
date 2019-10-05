import {on, off, fire} from './pubsub';
export const EVENT = {
	on,
	off,
	fire,


	bookmark: {
		added: 'bookmark-added',
		moved: 'bookmark-moved',
		removed: 'bookmark-removed',
	},
	settings: {
		loaded: 'settings-loaded',
	},
	dockedFolders: {
		loaded: 'docked-folders-loaded',
	},



};
