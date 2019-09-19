{#if item.type === 'separator'}
	<div class="item separator" data-id="{item.id}"><span class="item-thumb"></span></div>
{:else}
	<a
		href="{item.url || item.id}"
		class="item item-{item.type} item-{item.id}"
		data-id="{item.id}"
		on:click|preventDefault="{() => onclick(item)}"
	>
		<span class="item-thumb" bind:this={thumb}></span>
		<span class="item-title" title="{item.title}">{item.title}</span>
	</a>
{/if}


<script>
import {currentFolder} from '../store';
import {colorFromString, isDark} from '../lib';
import {afterUpdate} from 'svelte';


export let item;
let thumb;

function onclick (i) {
	if (i.type === 'folder') $currentFolder = i.id;
	else if (i.type === 'bookmark') location.href = i.url;
}


afterUpdate(() => {
	if (item.type === 'bookmark' && item.url) {
		const bg = colorFromString(item.url.replace(/(^https?:\/\/)|(\/$)/g, ''));
		const color = isDark(bg) ? '#ccc' : '#333';
		thumb.style = `background-color: ${bg}; color: ${color};`;
		thumb.innerText = item.title[0].toUpperCase();
	}
	else if (thumb) {
		thumb.style = '';
		thumb.innerText = '';
	}
});
</script>
