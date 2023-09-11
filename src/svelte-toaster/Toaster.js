import { writable } from 'svelte/store';

export const _toasts = writable({});

export function showToast (msg, type = 'info', timeout = 5000, btn, cb = () => {}) {
	const id = guid();
	let showProgress = false;
	if (typeof timeout === 'number') {
		setTimeout(() => hideToast(id), timeout);
		showProgress = true;
		timeout = timeout - 500;
	}
	const ariaLive = type === 'alert' || type === 'error' ? 'assertive' : 'polite';
	_toasts.update(list => {
		list[id] = { type, msg, id, ariaLive, timeout, cb, showProgress, btn };
		return list;
	});
	return id;
}

export function hideToast (id) {
	_toasts.update(list => {
		delete list[id];
		return list;
	});
}

function guid () {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = Math.random() * 16 | 0;
		const v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}
