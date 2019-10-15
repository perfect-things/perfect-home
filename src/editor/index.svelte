<Modal title="Edit bookmark" bind:this="{modal}">
	<form on:submit="{save}">
		<div class="editor-contents" bind:this="{itemEl}">
			<div class="thumb">
				<div class="item-thumb" bind:this={thumb}></div>
				<button type="button" on:click="{changeThumb}">Change</button>
				<button type="button" on:click="{() => clearThumb(item, itemEl)}">Clear</button>
				<input type="file" accept="image/png, image/jpeg" bind:this="{fileInput}" on:change="{onThumbnailSelect}">
			</div>
			<div class="details">
				<label for="title">Title</label>
				<input id="title" type="text" bind:value="{item.title}">
				<label for="url">URL</label>
				<input id="url" type="text" bind:value="{item.url}">
			</div>
		</div>
		<div>
		</div>
		<div class="buttons">
			<button type="button" class="btn danger" on:click="{() => delBookmark(item)}">Delete</button>
			<div class="flex-spacer"></div>
			<button type="button" class="btn" on:click="{cancel}">Cancel</button>
			<button type="submit" class="btn success" on:click="{save}">Save</button>
		</div>
	</form>
</Modal>

<script>
import Modal from '../modal';
import {onMount} from 'svelte';
import {items, thumbs} from '../store';
import {EVENT, getLetterThumbnail, getFavicon, animate, saveBookmark, deleteBookmark} from '../lib';

let modal, item = {}, thumb, itemEl, fileInput, targetEl;


onMount(() => {
	EVENT.on(EVENT.bookmark.edit, editBookmark);
	EVENT.on(EVENT.bookmark.delete, delBookmark);
});



function delBookmark (_item, _el) {
	cancel();
	setTimeout(() => {
		_el = _el || targetEl;
		const res = window.confirm(`Are you sure you wish to delete "${_item.title}"`);
		if (res) {
			const from = {transform: 'scale(1)', opacity: 1};
			const to = {transform: 'scale(0)', opacity: 0};
			animate(_el, from, to)
				.then(() => {
					_el.remove();
					deleteThumbForItem(_item.id);
					return deleteBookmark(_item.id);
				})
				.then(() => EVENT.fire(EVENT.bookmark.removed, item));
		}
	});
}


function changeThumb () {
	fileInput.click();
}


function onThumbnailSelect (e) {
	const reader = new FileReader();
	const _thumb = itemEl.querySelector('.item-thumb');
	reader.onload = ev => {
		const dataUri = ev.target.result;
		_thumb.innerText = '';
		_thumb.style.backgroundColor = 'unset';
		_thumb.style.backgroundImage = `url("${dataUri}")`;
		const _thumbs = $thumbs;
		_thumbs[item.id] = dataUri;
		thumbs.set(_thumbs);
	};
	reader.readAsDataURL(e.target.files[0]);
}


function deleteThumbForItem (id) {
	const _thumbs = $thumbs;
	if (_thumbs[id]) {
		delete _thumbs[id];
		thumbs.set(_thumbs);
	}
}

function clearThumb (_item, el) {
	let style, text;
	const itemThumb = el.querySelector('.item-thumb');
	const isTile = el.closest('main.bookmarks') || el.closest('.modal');
	if (isTile) {
		const letterThumb = getLetterThumbnail(item);
		style = letterThumb.style;
		text = letterThumb.innerText;
	}
	else {
		style = `background-image: url("${getFavicon(item.url)}")`;
		text = '';
	}
	itemThumb.style = style;
	itemThumb.innerText = text;
	deleteThumbForItem(_item.id);
}



function showThumb () {
	let style = '', innerText = '';
	if ($thumbs && $thumbs[item.id]) {
		style = `background-image: url("${$thumbs[item.id]}"); background-color: unset;`;
	}
	else if (item.type === 'bookmark' && item.url) {
		const letterThumb = getLetterThumbnail(item);
		style = letterThumb.style;
		innerText = letterThumb.innerText;
	}
	thumb.style = style;
	thumb.innerText = innerText;
}


function editBookmark (_item, _el) {
	item = _item;
	targetEl = _el;
	showThumb();
	modal.open();
}


function cancel () {
	modal.close();
}

function save (e) {
	if (e instanceof Event) e.preventDefault();
	saveBookmark(item);
	const idx = $items.findIndex(i => i.id === item.id);
	$items[idx] = item;
	items.set($items);
	cancel();
}

</script>
