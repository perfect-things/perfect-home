<div class="toaster">
	{#each toasts as toast (toast.id)}
		<div class="toast toast-{toast.type}"
			class:gone="{toast.gone}"
			in:fly="{{y: -100, duration: 200 }}"
			out:fly="{{ y: -100, duration: 400 }}"
			on:outrostart="{e => e.target.style.zIndex = 5}"
			animate:flip="{{ duration: 200 }}"
			on:click="{() => hideToast(toast.id)}">{toast.msg}</div>
	{/each}
</div>


<script context="module">
import { writable, get } from 'svelte/store';
import { fly } from 'svelte/transition';
import { flip } from 'svelte/animate';

let _toasts = writable([]);

export function showToast (msg, type = 'info', timeout = 5000) {
	const id = guid();
	_toasts.set([...get(_toasts), { type, msg, id }]);
	if (typeof timeout === 'number') setTimeout(() => hideToast(id), timeout);
	return id;
}

export function hideToast (id) {
	const filtered = get(_toasts).filter(t => t.id !== id);
	_toasts.set(filtered);
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
let toasts = [];
_toasts.subscribe(val => toasts = val);
</script>
