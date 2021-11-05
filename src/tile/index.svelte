{#if item.type === 'separator'}
	<div class="item separator" data-id="{item.id}"><span class="item-thumb"></span></div>
{:else if item.type === 'folder'}
	<a
		href="{item.id}"
		class="item item-folder item-{item.id}"
		title="{item.title || ''}"
		data-id="{item.id}"
		on:click|preventDefault="{() => $currentFolder = item.id}"
		in:onIn
		out:onOut
	>
		<span class="item-thumb" bind:this={thumb}
			class:img-drag="{imgDrag}"
			on:dragenter|preventDefault|stopPropagation|capture="{() => imgDrag = true}"
			on:dragleave|preventDefault|stopPropagation|capture="{() => imgDrag = false}"
			on:drop|preventDefault|stopPropagation|capture="{ondrop}"
		></span>
		<span class="item-title" class:img-drag="{imgDrag}">{
			$options.showLabels || !$thumbs[item.id] ? (item.title || '') : ''
		}</span>
	</a>
{:else}
	<a
		href="{item.url}"
		class="item item-{item.type} item-{item.id}"
		title="{item.title || ''}"
		data-id="{item.id}"
		target="{$options.openLinksInNewTab ? '_blank' : '_self'}"
		on:click="{onclick}"
		in:onIn
		out:onOut
	>
		<span class="item-thumb" bind:this={thumb}
			class:img-drag="{imgDrag}"
			on:dragenter|preventDefault|stopPropagation|capture="{() => imgDrag = true}"
			on:dragleave|preventDefault|stopPropagation|capture="{() => imgDrag = false}"
			on:drop|preventDefault|stopPropagation|capture="{ondrop}"
		>
			<TextFit>{letterThumb}</TextFit>
			<span class="item-thumb-suffix">{letterThumbSuff}</span>
		</span>
		<span class="item-favicon" bind:this={favicon}></span>
		<span class="item-title">{item.title || ''}</span>
	</a>
{/if}


<script>
import TextFit from '../svelte-text-fit';
import {EVENT, getLetterThumbnail, getFavicon, isImage, initialLoad,
	currentFolder, thumbs, wasSorted, options} from '../lib';
import {onMount, afterUpdate} from 'svelte';
import {fade} from 'svelte/transition';

export let item;
let thumb;
let favicon;
let letterThumb = '', letterThumbSuff = '';
let imgDrag = false;


function onIn (node) {
	if (!$options.animSpeed || $initialLoad) return;
	return fade(node, { delay: Math.max($options.animSpeed - 50, 0), duration: $options.animSpeed });
}

function onOut (node) {
	if (!$options.animSpeed || $initialLoad) return;
	return fade(node, { duration: Math.max($options.animSpeed - 50, 0) });
}



function ondrop (e) {
	imgDrag = false;
	const dt = e.dataTransfer;
	const files = dt.files;
	const file = files.length && files[0];
	if (!file) return;

	const reader = new FileReader();
	reader.onload = ev => EVENT.fire(EVENT.bookmark.thumbDropped, item, ev.target.result);
	reader.readAsDataURL(file);
}

function onclick (e) {
	if ($wasSorted) e.preventDefault();
	if (!item.url) return;
	if (item.url.startsWith('file://')) {
		try { location.href = item.url; }
		catch { EVENT.fire(EVENT.document.localLink); }
	}
}


function onBookmarkSave (bookmark) {
	if (item.id === bookmark.id) item = bookmark;
}

onMount(() => {
	EVENT.on(EVENT.bookmark.saved, onBookmarkSave);
});

afterUpdate(() => {
	if (!thumb) return;

	let style = '';
	letterThumb = '';
	letterThumbSuff = '';

	// bookmark has a custom thumbnail
	if ($thumbs && $thumbs[item.id]) {
		style = `background-image: url("${$thumbs[item.id]}"); background-color: unset; -webkit-mask: none; mask: none;`;
	}
	// bookmark is a link to an image. This may not work for local files on some systems
	else if (isImage(item.url)) {
		style = `background-image: url("${item.url}"); background-color: unset;`;
	}
	else if (item.type === 'bookmark' && item.url) {
		const letterThumbnail = getLetterThumbnail(item);
		style = letterThumbnail.style;
		letterThumb = letterThumbnail.text;
		letterThumbSuff = letterThumbnail.suf;
	}
	if (favicon) favicon.style = `background-image: url("${getFavicon(item.url)}")`;
	thumb.style = style;
});

</script>
