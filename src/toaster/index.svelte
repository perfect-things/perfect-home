<div class="toaster">
	{#each toasts as toast (toast.id)}
		<div class="toast toast-{toast.type}"
			class:gone="{toast.gone}"
			in:fly="{{y: -100, duration: 200 }}"
			out:fly="{{ y: -100, duration: 400 }}"
			on:outrostart="{e => e.target.style.zIndex = 5}"
			animate:flip="{{ duration: 200 }}"
			on:click|preventDefault="{e => toast.cb(e, toast.id)}">
				<div class="toast-msg">{@html toast.msg}</div>
				<div class="toast-close" on:click="{hideToast(toast.id)}">&times;</div>
				<div class="toast-progressbar">
					<div class="toast-progress" style="width: {progress[toast.id]}%;"></div>
				</div>
			</div>
	{/each}
</div>


<script context="module">
import { writable } from 'svelte/store';
import { fly } from 'svelte/transition';
import { flip } from 'svelte/animate';

const _toasts = writable({});

export function showToast (msg, type = 'info', timeout = 5000, cb = () => {}) {
	const id = guid();
	if (typeof timeout === 'number') setTimeout(() => hideToast(id), timeout);
	_toasts.update(list => {
		list[id] = { type, msg, id, timeout: timeout - 500, cb };
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
let toasts = [], timers = {}, progress = {};
_toasts.subscribe(val => {
	toasts = Object.values(val);
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
