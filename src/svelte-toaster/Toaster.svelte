<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
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

<script>
import { scale } from 'svelte/transition';
import { options } from '../lib';
import { _toasts, hideToast } from './Toaster.js';

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
