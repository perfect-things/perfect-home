<ul class="context-menu {opened ? '' : 'hidden'}" bind:this="{menuEl}">
	<li class="context-menu-item" on:click="{editBookmark}">Edit bookmark</li>
	<li class="context-menu-item context-menu-separator"></li>
	<li class="context-menu-item" on:click="{delBookmark}">Delete bookmark</li>
</ul>

<svelte:window on:click={onDocumentClick} on:contextmenu="{onContextMenu}"/>

<script>
import {EVENT, getBookmark} from '../lib';

let menuEl;
let item, el;
let opened = false;

function editBookmark () {
	close();
	setTimeout(() => EVENT.fire(EVENT.bookmark.edit, item, el));
}

function delBookmark () {
	close();
	setTimeout(() => EVENT.fire(EVENT.bookmark.delete, item, el));
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
