<ul class="context-menu {opened ? '' : 'hidden'}" bind:this="{menuEl}">
	{#if !hasThumbnail}
		<li class="context-menu-item" on:click="{customThumbnail}">
			<input type="file" accept="image/png, image/jpeg" bind:this="{fileInput}" on:change="{onThumbnailSelect}">
			Set thumbnail
		</li>
	{:else}
		<li class="context-menu-item" on:click="{customThumbnail}">
			<input type="file" accept="image/png, image/jpeg" bind:this="{fileInput}" on:change="{onThumbnailSelect}">
			Change thumbnail
		</li>
		<li class="context-menu-item" on:click="{clearThumbnail}">Clear thumbnail</li>
	{/if}
	<li class="context-menu-item context-menu-separator"></li>
	<li class="context-menu-item" on:click="{deleteBookmark}">Delete bookmark</li>
</ul>

<svelte:window on:click={onDocumentClick} on:contextmenu="{onContextMenu}"/>

<script>
import {thumbs} from '../store';
import {animate, getBookmark, delBookmark, getLetterThumbnail, getFavicon} from '../lib';

let menuEl;
let item, el, hasThumbnail = false;
let opened = false;
let fileInput;


function deleteBookmark () {
	const from = {transform: 'scale(1)', opacity: 1};
	const to = {transform: 'scale(0)', opacity: 0};
	animate(el, from, to).then(() => el.remove());
	delBookmark(item.id);
	close();
}


function customThumbnail () {
	fileInput.click();
	close();
}

function clearThumbnail () {
	let style, text;
	const thumb = el.querySelector('.item-thumb');
	const isTile = el.closest('main.bookmarks');
	if (isTile) {
		const letterThumb = getLetterThumbnail(item);
		style = letterThumb.style;
		text = letterThumb.innerText;
	}
	else {
		style = `background-image: url("${getFavicon(item.url)}")`;
		text = '';
	}
	thumb.style = style;
	thumb.innerText = text;

	const _thumbs = $thumbs;
	delete _thumbs[item.id];
	thumbs.set(_thumbs);

	close();
}

function onThumbnailSelect (e) {
	const reader = new FileReader();
	const thumb = el.querySelector('.item-thumb');
	reader.onload = ev => {
		const dataUri = ev.target.result;
		thumb.innerHTML = '';
		thumb.style.backgroundColor = 'unset';
		thumb.style.backgroundImage = `url("${dataUri}")`;
		const _thumbs = $thumbs;
		_thumbs[item.id] = dataUri;
		thumbs.set(_thumbs);
	};
	reader.readAsDataURL(e.target.files[0]);
}

function updatePosition (e)  {
	menuEl.style.left = e.pageX + 'px';
	menuEl.style.top = e.pageY + 'px';
}

function onContextMenu (e) {
	el = e.target.closest('.item, .folder-item');
	if (!el) return;
	if (el.classList.contains('item-folder')) return;
	e.preventDefault();
	updatePosition(e);
	getBookmark(el.dataset.id).then(i => {
		item = i;
		hasThumbnail = !!$thumbs[item.id];
		if (item.type === 'bookmark') open();
	});
}

function onDocumentClick (e) {
	if (!e.target.closest('.context-menu')) close();
}


function open () {
	opened = true;
}

function close () {
	opened = false;
}

</script>
