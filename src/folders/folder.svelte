<div class="folder folder-{folder.id}"
	class:folder-expanded="{expanded}"
	class:folder-pinned="{folder.pinned}"
	data-id="{folder.id}" bind:this="{folderEl}">

	<h2 class="folder-header">
		<button class="folder-pin"
			aria-hidden="{expanded ? null : true}"
			on:click="{togglePin}"
			title="{folder.pinned ? 'Unpin' : 'Pin'}"></button>

		<button class="folder-title"
			on:click="{toggle}"
			title="{expanded ? 'Close' : 'Open'}">{folder.title}</button>
	</h2>

	<div class="folder-items" bind:this="{folderItemsEl}">
		{#each items as item (item.id)}
			<Tile item="{item}" />
		{/each}
	</div>
</div>


<script>
import Tile from '../tile';
import {onMount, tick} from 'svelte';
import {EVENT, wasSorted, dockedFolders, getSubTree, getFolderTitle, moveBookmark, saveDockedFolders} from '../lib';
import Sortable from 'sortablejs';

export let folder;
let folderEl;
let folderItemsEl;
let items = [];
let expanded = false;


onMount(() => {
	new Sortable(folderItemsEl, {
		group: {
			name: 'bookmarks',
			put: (to, from, item) => !item.classList.contains('item-folder')
		},
		animation: 200,
		emptyInsertThreshold: 100,
		ghostClass: 'sortable-ghost',
		onStart: e => {
			$wasSorted = true;
			e.item.classList.add('sortable-plate');
		},
		onEnd: e => {
			e.item.classList.remove('sortable-plate');
			$wasSorted = false;
		},
		onSort: onsort,
		onAdd: open,
		onRemove: open,
		onMove: open,
		onChange: open,
	});

	EVENT.on(EVENT.document.clicked, onDocClick);
	EVENT.on(EVENT.bookmark.added, onBookmarkRemove);
	EVENT.on(EVENT.bookmark.removed, onBookmarkRemove);
	EVENT.on(EVENT.dockedFolders.changed, onDockedFoldersChange);

	if (folder.id) onDockedFoldersChange(folder.id);
});


function onDocClick (e) {
	if (e.target.closest(`.folder-${folder.id}`)) return;
	if (folder.pinned) return;
	close();
}


function onDockedFoldersChange (id) {
	if (id !== folder.id && folder.title) return;
	getFolderTitle(folder.id).then(title => {
		if (folder.title !== title) {
			folder.title = title;
			saveDockedFolders($dockedFolders);
		}
		if (id === folder.id) readFolder();
		setTimeout(() => (folder.pinned ? open() : close()), 100);
		setTimeout(() => (folder.pinned ? open() : close()), 300);
		setTimeout(() => (folder.pinned ? open() : close()), 500);
	});
}


function onBookmarkRemove (item) {
	if (item.parentId === folder.id) {
		readFolder()
			.then(tick)
			.then(() => {
				open();
				setTimeout(open, 300);    // thank you svelte
			});
	}
}

function onsort (e) {
	const isInFolder = e.item.closest('.folder-items');
	if (isInFolder) moveBookmark(e.item.dataset.id, {parentId: folder.id, index: e.newIndex});
}

function togglePin () {
	folder.pinned = !folder.pinned;
	saveDockedFolders($dockedFolders);
}

function toggle () {
	expanded ? close() : open();
}

function open () {
	if (!folderEl) return;
	folderItemsEl.classList.remove('hidden');
	const folderH = folderEl.getBoundingClientRect().height;
	folderEl.style.marginTop = -folderH + 'px';
	expanded = true;
}

function close () {
	if (!folderEl) return;
	folderEl.style.marginTop = '-41px';
	folderItemsEl.classList.add('hidden');
	expanded = false;
}


function readFolder (id = folder.id) {
	return getSubTree(id)
		.then(_items => {
			if (!_items || !_items.length) return;
			items = _items.filter(i => i.type !== 'folder');
			return items;
		});
}

</script>
