<Modal title="Edit bookmark" bind:this="{modal}">
	<form on:submit="{save}">
		<div class="editor-contents" bind:this="{itemEl}">
			<div class="thumb">
				<div class="item-thumb" bind:this={thumb}></div>
			</div>
			<div class="details">
				<label for="title">Title</label>
				<input id="title" type="text" bind:value="{item.title}">
				<label for="url">URL</label>
				<input id="url" type="text" bind:value="{item.url}">

				<label for="thumb_url" class="thumbnail-label">
					Thumbnail URL
					<button type="button" on:click="{() => clearThumb(item, itemEl)}">Clear</button>
					<button type="button" on:click="{changeThumb}">Browse</button>
					<input type="file" tabindex="-1" accept="image/png, image/jpeg"
						bind:this="{fileInput}"
						on:change="{onThumbnailSelect}">
				</label>
				<textarea id="thumb_url" on:input="{onThumbUrlChange}">{thumbnail || ''}</textarea>
			</div>
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
import {EVENT, getLetterThumbnail, getFavicon, animate, saveBookmark, deleteBookmark, createBookmark} from '../lib';
import {showToast, hideToast} from '../toaster';

let modal, item = {}, thumb, itemEl, fileInput, targetEl, thumbnail;


onMount(() => {
	EVENT.on(EVENT.bookmark.edit, editBookmark);
	EVENT.on(EVENT.bookmark.delete, delBookmark);
});

function onThumbUrlChange (ev) {
	const url = ev.target.value;
	if (url) thumbChangedTo(ev.target.value);
	else clearThumb(item, itemEl);
}

function delBookmark (_item, _el) {
	cancel();

	_el = _el || targetEl;
	animate(_el, {transform: 'scale(1)', opacity: 1}, {transform: 'scale(0)', opacity: 0})
		.then(() => {
			const undo = undoDelete(_item, $thumbs[_item.id]);
			showToast('Bookmark has been removed.', 'info', 10000, 'Undo', (e, id) => {
				if (e.target.closest('button')) {
					hideToast(id);
					undo();
				}
			});
			saveThumbnail(_item.id);
			return deleteBookmark(_item.id);
		})
		// update docked folder height
		.then(() => EVENT.fire(EVENT.bookmark.removed, _item));

}


function undoDelete (_item, _thumb) {
	return () => {
		delete _item.id;
		delete _item.dateAdded;
		createBookmark(_item)
			.then(node => {
				if (_thumb) saveThumbnail(node, _thumb);
				EVENT.fire(EVENT.bookmark.added, node);
			});
	};
}


function saveThumbnail (_item, url = '') {
	const _thumbs = $thumbs;
	const id = _item.id;
	if (url) _thumbs[id] = url;
	else if (_thumbs[id]) delete _thumbs[id];
	thumbs.set(_thumbs);
}



function thumbChangedTo (url) {
	thumbnail = url;
	const _thumb = itemEl.querySelector('.item-thumb');
	_thumb.innerText = '';
	_thumb.style.backgroundColor = 'unset';
	_thumb.style.backgroundImage = `url("${url}")`;
}


function changeThumb () {
	fileInput.click();
}


function onThumbnailSelect (e) {
	const reader = new FileReader();
	reader.onload = ev => thumbChangedTo(ev.target.result);
	reader.readAsDataURL(e.target.files[0]);
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
	thumbnail = '';
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
	thumbnail = $thumbs[item.id] || '';
	showThumb();
	modal.open();
}


function cancel () {
	modal.close();
}

function save (e) {
	if (e instanceof Event) e.preventDefault();
	saveBookmark(item);
	saveThumbnail(item, thumbnail);
	EVENT.fire(EVENT.bookmark.saved, item);
	const idx = $items.findIndex(i => i.id === item.id);
	$items[idx] = item;
	items.set($items);
	cancel();
}

</script>
