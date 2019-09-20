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
import {currentFolder, thumbs} from '../store';
import {colorFromString, isDark} from '../lib';
import {afterUpdate} from 'svelte';


export let item;
let thumb;

function onclick (i) {
	if (i.type === 'folder') $currentFolder = i.id;
	else if (i.type === 'bookmark') location.href = i.url;
}


afterUpdate(() => {
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
