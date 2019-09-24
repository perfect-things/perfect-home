<ul class="context-menu {opened ? '' : 'hidden'}" bind:this="{menuEl}">
	<li class="context-menu-item" on:click="{customThumbnail}">
		<input type="file" accept="image/png, image/jpeg"
			bind:this="{fileInput}"
			on:change="{onThumbnailSelect}">
		Custom thumbnail
	</li>
	<li class="context-menu-item context-menu-separator"></li>
	<li class="context-menu-item" on:click="{deleteBookmark}">Delete bookmark</li>
</ul>

<svelte:window on:click={onDocumentClick} on:contextmenu="{onContextMenu}"/>

<script>
import {thumbs} from '../store';
import {animate, getBookmark, delBookmark} from '../lib';

let menuEl;
let item, el;
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
	el = e.target.closest('.item');
	if (!el) return;
	e.preventDefault();
	getBookmark(el.dataset.id).then(i => item = i);
	updatePosition(e);
	open();
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
