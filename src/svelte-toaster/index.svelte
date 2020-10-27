<div class="toaster toaster-{position}">
	{#each toasts as toast (toast.id)}
		<div aria-live="{toast.ariaLive}" role="status"
			class="toast toast-{toast.type}"
			transition:scale="{{ start: 0.5, duration: $options.animSpeed }}"
			on:click|preventDefault="{e => toast.cb(e, toast.id)}">
				<div class="toast-msg">{toast.msg}</div>
				{#if toast.btn}
					<button>{toast.btn}</button>
				{/if}
				<button class="toast-close" on:click|stopPropagation="{() => hideToast(toast.id)}">&times;</button>
				{#if toast.showProgress}
					<div class="toast-progressbar">
						<div class="toast-progress" style="width: {progress[toast.id]}%"></div>
					</div>
				{/if}
			</div>
	{/each}
</div>


<script context="module">
import { writable } from 'svelte/store';
import { scale } from 'svelte/transition';
import { options } from '../lib';

const _toasts = writable({});

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
</script>

<script>
export let position = 'bottom';
let toasts = [], timers = {}, progress = {};

_toasts.subscribe(val => {
	toasts = Object.values(val);
	if (!toasts.length) {
		timers = {};
		progress = {};
	}
	toasts.forEach(t => {
		if (!timers[t.id]) createTimer(t.id, t.timeout);
	});
});

function createTimer (id, timeout) {
	progress[id] = 0;
	timers[id] = setInterval(() => {
		progress[id] += 1;
		if (progress[id] >= 100) clearInterval(timers[id]);
	}, timeout / 100);
}
</script>
