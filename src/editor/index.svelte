<Modal title="Edit bookmark" bind:this="{modal}">
	<form on:submit="{save}">
		<div class="editor-contents" bind:this="{itemEl}">
			<div class="thumb">
				<div class="item-thumb" bind:this={thumb}>
					<TextFit>{letterThumb}</TextFit>
					<span class="item-thumb-suffix">{letterThumbSuff}</span>
				</div>

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
					{#if $options.theme}
						<button type="button" on:click="{openPicker}">Pick from theme</button>
					{/if}
				</label>
				<textarea id="thumb_url" on:input="{onThumbUrlChange}">{thumbnailUrl || ''}</textarea>
			</div>
		</div>
		<div class="buttons">
			<button type="submit" class="btn success" on:click="{save}">Save</button>
			<button type="button" class="btn" on:click="{cancel}">Cancel</button>
			<div class="flex-spacer"></div>
			<button type="button" class="btn danger" on:click="{() => delBookmark(item)}">Delete</button>
		</div>
	</form>
</Modal>

<script>
import {onMount} from 'svelte';
import Modal from '../svelte-modal';
import TextFit from '../svelte-text-fit';
import {showToast, hideToast} from '../svelte-toaster';
import {EVENT, items, thumbs, getLetterThumbnail, getFavicon, animate, getThemeIcon,
	saveBookmark, deleteBookmark, createBookmark, themes, options} from '../lib';

let modal, item = {}, thumb, itemEl, fileInput, targetEl, thumbnailUrl;
let letterThumb = '', letterThumbSuff = '';

onMount(() => {
	EVENT.on(EVENT.bookmark.edit, editBookmark);
	EVENT.on(EVENT.bookmark.delete, delBookmark);
	EVENT.on(EVENT.bookmark.thumbDropped, thumbDropped);
	EVENT.on(EVENT.iconPicker.picked, pickedIconFromTheme);
});


function openPicker (e) {
	EVENT.fire(EVENT.iconPicker.open, e.target);
}

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
	thumbnailUrl = url;
	letterThumb = '';
	letterThumbSuff = '';
	const _thumb = itemEl.querySelector('.item-thumb');
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
	let style = '', text = '', suf = '';
	const itemThumb = el.querySelector('.item-thumb');
	const isTile = el.closest('main.bookmarks') || el.closest('.modal');
	if (isTile) {
		const letterThumbnail = getLetterThumbnail(item);
		style = letterThumbnail.style;
		text = letterThumbnail.text;
		suf = letterThumbnail.suf;
	}
	else {
		style = `background-image: url("${getFavicon(item.url)}")`;
	}
	itemThumb.style = style;
	letterThumb = text;
	letterThumbSuff = suf;
	thumbnailUrl = '';
}



function showThumb () {
	let style = '', text = '', suf = '';
	if ($thumbs && $thumbs[item.id]) {
		style = `background-image: url("${$thumbs[item.id]}"); background-color: unset;`;
	}
	else if (item.type === 'bookmark' && item.url) {
		const letterThumbnail = getLetterThumbnail(item);
		style = letterThumbnail.style;
		text = letterThumbnail.text;
		suf = letterThumbnail.suf;
	}
	thumb.style = style;
	letterThumb = text;
	letterThumbSuff = suf;
}


function editBookmark (_item, _el) {
	item = _item;
	targetEl = _el;
	thumbnailUrl = $thumbs[item.id] || '';
	showThumb();
	modal.open();
	themes.load();
}


function cancel () {
	modal.close();
}

function save (e) {
	if (e instanceof Event) e.preventDefault();
	saveBookmark(item);
	saveThumbnail(item, thumbnailUrl);
	EVENT.fire(EVENT.bookmark.saved, item);
	const idx = $items.findIndex(i => i.id === item.id);
	$items[idx] = item;
	items.set($items);
	cancel();
}


function undoThumbChange (_item, _thumb) {
	return () => {
		thumbnailUrl = _thumb || '';
		save();
	};
}

function thumbDropped (_item, _url) {
	item = _item;
	thumbnailUrl = _url;
	const undo = undoThumbChange(_item, $thumbs[_item.id]);
	showToast('Thumbnail changed.', 'info', 10000, 'Undo', (e, id) => {
		if (e.target.closest('button')) {
			hideToast(id);
			undo();
		}
	});
	save();
}


function pickedIconFromTheme (icon) {
	getThemeIcon(icon.url).then(thumbChangedTo);
}

</script>
