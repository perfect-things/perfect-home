<!--svelte-ignore
	a11y-click-events-have-key-events
	a11y-no-noninteractive-element-interactions -->

<ul class="context-menu" class:hidden="{!opened}" bind:this="{menuEl}">
	{#if !isFolder}
		<li class="context-menu-item" on:click="{() => newTab()}">Open in New Tab</li>
		<li class="context-menu-item" on:click="{() => newTab(true)}">Open in Background Tab</li>
		<li class="context-menu-item" on:click="{newWin}">Open in New Window</li>
		<li class="context-menu-item context-menu-separator"></li>
		<li class="context-menu-item" on:click="{copyUrl}">Copy URL</li>
		<li class="context-menu-item context-menu-separator"></li>
		<li class="context-menu-item" on:click="{editBookmark}">Edit</li>
		<li class="context-menu-item" on:click="{delBookmark}">Delete</li>
	{:else}
		<li class="context-menu-item" on:click="{editBookmark}">Edit</li>
	{/if}
</ul>

<svelte:window on:click={onDocumentClick} on:contextmenu="{onContextMenu}"/>

<script>
import { EVENT, getBookmark, newtab, newwindow, copyToClipboard } from '../lib';
import { showToast } from '../svelte-toaster';

let menuEl;
let item, el;
let opened = false;
let isFolder = false;

function newTab (bg) {
	close();
	newtab({ active: !bg, url: item.url });
}

function newWin () {
	close();
	newwindow({ url: item.url });
}

function copyUrl () {
	close();
	copyToClipboard(item.url);
	showToast('URL copied to the Clipboard.', 'info', 2000);
}

function editBookmark () {
	close();
	setTimeout(() => EVENT.fire(EVENT.bookmark.edit, item, el));
}

function delBookmark () {
	close();
	setTimeout(() => EVENT.fire(EVENT.bookmark.delete, item, el));
}

function updatePosition (e) {
	if (e) {	// update position to pointer
		menuEl.style.left = e.pageX + 'px';
		menuEl.style.top = e.pageY + 'px';
	}
	else {		// make sure it stays on screen
		const { x, y, width, height } = menuEl.getBoundingClientRect();
		const winH = window.innerHeight;
		const winW = window.innerWidth;
		const padding = 10;
		let left = x, top = y;
		if (winH - height - y < padding) top = winH - height - padding;
		if (winW - width - x < padding) left = winW - width - padding;
		menuEl.style.left = left + 'px';
		menuEl.style.top = top + 'px';
	}
}

function onContextMenu (e) {
	el = e.target.closest('.item');
	if (!el) return;
	e.stopPropagation();
	e.preventDefault();

	isFolder = false;
	e.preventDefault();
	if (el.classList.contains('item-folder')) isFolder = true;
	updatePosition(e);
	getBookmark(el.dataset.id).then(i => {
		item = i;
		open();
	});
}

function onDocumentClick (e) {
	if (e.button !== 0) return;
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
