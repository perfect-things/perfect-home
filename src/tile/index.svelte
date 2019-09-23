{#if item.type === 'separator'}
	<div class="item separator" data-id="{item.id}"><span class="item-thumb"></span></div>
{:else if item.type === 'folder'}
	<a
		href="{item.id}"
		class="item item-folder item-{item.id}"
		data-id="{item.id}"
		on:click|preventDefault="{() => $currentFolder = item.id}"
	>
		<span class="item-thumb" bind:this={thumb}></span>
		<span class="item-title" title="{item.title}">{item.title}</span>
	</a>
{:else}
	<a
		href="{item.url}"
		class="item item-{item.type} item-{item.id}"
		data-id="{item.id}"
	>
		<span class="item-thumb" bind:this={thumb}></span>
		<span class="item-title" title="{item.title}">{item.title}</span>
	</a>
{/if}


<script>
import {currentFolder, thumbs} from '../store';
import {colorFromString, isDark} from '../lib';
import {afterUpdate} from 'svelte';


export let item;
let thumb;

afterUpdate(() => {
	if (!thumb) return;

	let style = '', innerText = '';
	if ($thumbs && $thumbs[item.id]) {
		style = `background-image: url("${$thumbs[item.id]}"); background-color: unset;`;
	}
	else if (item.type === 'bookmark' && item.url) {
		const bg = colorFromString(item.url.replace(/(^https?:\/\/)|(\/$)/g, ''));
		const color = isDark(bg) ? '#ccc' : '#333';
		style = `background-color: ${bg}; color: ${color};`;
		innerText = item.title[0].toUpperCase();
	}
	thumb.style = style;
	thumb.innerText = innerText;
});

</script>
