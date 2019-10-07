<div class="folder folder-{folder.id}" data-id="{folder.id}" bind:this="{folderEl}">

	<h2 class="folder-title" on:click="{toggle}">{folder.title}</h2>

	<div class="folder-items" bind:this="{folderItemsEl}">
		{#if items && items.length}
			{#each items as item}
				<Tile item="{item}" />
			{/each}
		{:else}
			<span class="folder-empty">Folder is empty</span>
		{/if}
	</div>
</div>


<script>
import Tile from '../tile';
import {onMount} from 'svelte';
import {wasSorted, dockedFolders} from '../store';
import {EVENT, animate, getSubTree, getFolderTitle, moveBookmark, saveDockedFolders} from '../lib';
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
			put: (to, from, item) => {
				return !item.classList.contains('item-folder');
			}
		},
		animation: 200,
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
		onAdd: addremove,
		onRemove: addremove,
	});

	EVENT.on(EVENT.bookmark.removed, onBookmarkRemove);
	EVENT.on(EVENT.dockedFolders.changed, onDockedFoldersChange);

	if (folder.id) readFolder(folder.id);
	if (folderEl) setTimeout(() => toggle(folder.open, true), 100);
});


function onDockedFoldersChange (id) {
	if (id !== folder.id) return;
	getFolderTitle(folder.id).then(title => {
		if (folder.title !== title) {
			folder.title = title;
			saveDockedFolders($dockedFolders);
			readFolder(folder.id);
			if (folder.open) toggle(false, true);
		}
	});
}


function onBookmarkRemove (item) {
	if (item.parentId === folder.id) toggle(true);
}

function addremove () {
	toggle(true);
}

function onsort (e) {
	const isInFolder = e.item.closest('.folder-items');
	if (isInFolder) moveBookmark(e.item.dataset.id, {parentId: folder.id, index: e.newIndex});
}

function toggle (forceOpen, noAnim) {
	if (!folderEl) return;
	const folderH = folderEl.getBoundingClientRect().height;
	let from = 'translateY(-42px)';
	let to = `translateY(-${folderH}px)`;
	expanded = (typeof forceOpen === 'boolean') ? forceOpen : !expanded;
	if (!expanded) [from, to] = [to, from];

	if (noAnim) folderEl.style.transform = to;
	else animate(folderEl, {transform: from}, {transform: to});

	folder.open = expanded;
	if (forceOpen !== true) saveDockedFolders($dockedFolders);
}


function readFolder (id) {
	return getSubTree(id)
		.then(tree => {
			if (!tree || !tree.length) return;
			items = tree[0].children.filter(i => i.type !== 'folder');
		})
		.catch(e => console.error(e));
}

</script>
