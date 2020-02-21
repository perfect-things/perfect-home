<span class="text-fit" bind:this="{el}">
	<slot></slot>
</span>

<script>

import {onMount, onDestroy} from 'svelte';
const MARGIN = 30;
const DEBOUNCE_RESIZE = 100;
let el, parent, resizeObserver, timer, mutationObserver;

function resize () {
	el.style.transform = '';
	const textW = el.getBoundingClientRect().width;
	const parentW = parent.getBoundingClientRect().width;
	const val = Math.min((parentW - MARGIN) / textW, 1);	// only shrink
	el.style.transform = `matrix(${val}, 0, 0, ${val}, 0, 0)`;
}

onMount(() => {
	parent = el.parentNode;
	resizeObserver = new ResizeObserver(() => {
		if (timer) clearTimeout(timer);
		timer = setTimeout(resize, DEBOUNCE_RESIZE);
	});
	resizeObserver.observe(parent);

	mutationObserver = new MutationObserver(resize);
	mutationObserver.observe(el.firstChild, { characterData: true });

	resize();
});

onDestroy(() => {
	resizeObserver.unobserve(parent);
	mutationObserver.disconnect();
});
</script>
