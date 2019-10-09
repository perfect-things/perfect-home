<ul class="context-menu {opened ? '' : 'hidden'}" bind:this="{menuEl}">
	{#if hasThumbnail}
		<li class="context-menu-item" on:click="{customThumbnail}">
			<input type="file" accept="image/png, image/jpeg" bind:this="{fileInput}" on:change="{onThumbnailSelect}">
			Change thumbnail
		</li>
		<li class="context-menu-item" on:click="{clearThumbnail}">Clear thumbnail</li>
	{:else}
		<li class="context-menu-item" on:click="{customThumbnail}">
			<input type="file" accept="image/png, image/jpeg" bind:this="{fileInput}" on:change="{onThumbnailSelect}">
			Set thumbnail
		</li>
	{/if}
	<li class="context-menu-item context-menu-separator"></li>
	<li class="context-menu-item" on:click="{delBookmark}">Delete bookmark</li>
</ul>

<svelte:window on:click={onDocumentClick} on:contextmenu="{onContextMenu}"/>

<script>
import {thumbs} from '../store';
import {EVENT, animate, getBookmark, deleteBookmark, getLetterThumbnail, getFavicon} from '../lib';

let menuEl;
let item, el, hasThumbnail = false;
let opened = false;
let fileInput;


function delBookmark () {
	close();
	const res = window.confirm(`Are you sure you wish to delete "${item.title}"`);
	if (res) {
		const from = {transform: 'scale(1)', opacity: 1};
		const to = {transform: 'scale(0)', opacity: 0};
		animate(el, from, to)
			.then(() => {
				el.remove();
				deleteThumbForItem(item.id);
				return deleteBookmark(item.id);
			})
			.then(() => EVENT.fire(EVENT.bookmark.removed, item));
	}
}


function customThumbnail () {
	fileInput.click();
	close();
}

function deleteThumbForItem (id) {
	const _thumbs = $thumbs;
	if (_thumbs[id]) {
		delete _thumbs[id];
		thumbs.set(_thumbs);
	}
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
	deleteThumbForItem(item.id);
	close();
}

function onThumbnailSelect (e) {
	const reader = new FileReader();
	const thumb = el.querySelector('.item-thumb');
	reader.onload = ev => {
		const dataUri = ev.target.result;
		thumb.innerText = '';
		thumb.style.backgroundColor = 'unset';
		thumb.style.backgroundImage = `url("${dataUri}")`;
		const _thumbs = $thumbs;
		_thumbs[item.id] = dataUri;
		thumbs.set(_thumbs);
	};
	reader.readAsDataURL(e.target.files[0]);
}

function updatePosition (e)  {
	if (e) {	// update position to pointer
		menuEl.style.left = e.pageX + 'px';
		menuEl.style.top = e.pageY + 'px';
	}
	else {		// make sure it stays on screen
		let {x, y, width, height} = menuEl.getBoundingClientRect();
		const winH = window.innerHeight;
		const winW = window.innerWidth;
		const padding = 10;
		if (winH - height - y < padding) y = winH - height - padding;
		if (winW - width - x < padding) x = winW - width - padding;
		menuEl.style.left = x + 'px';
		menuEl.style.top = y + 'px';
	}
}

function onContextMenu (e) {
	el = e.target.closest('.item');
	if (!el) return;
	if (el.classList.contains('item-folder')) return;
	e.preventDefault();
	updatePosition(e);
	getBookmark(el.dataset.id).then(i => {
		item = i;
		hasThumbnail = !!$thumbs[item.id];
		open();
	});
}

function onDocumentClick (e) {
	if (!e.target.closest('.context-menu')) close();
}


function open () {
	opened = true;
	// needs to finish rendering first
	setTimeout(updatePosition);
}

function close () {
	opened = false;
}

</script>
