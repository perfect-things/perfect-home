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
		group: 'bookmarks',
		animation: 200,
		ghostClass: 'sortable-ghost',
		onStart: e => {
			$wasSorted = true;
			e.item.classList.add('sortable-plate');
		},
		onEnd: e => {
			e.item.classList.remove('sortable-plate');
			setTimeout(() => $wasSorted = false, 100);
		},
		onSort: onsort,
		onAdd: addremove,
		onRemove: addremove,
	});

	if (!folder.title) getFolderTitle(folder.id).then(title => folder.title = title);
	if (folder.id) readFolder(folder.id);
	if (folder.open) initialExpand();
	EVENT.on(EVENT.bookmark.removed, onBookmarkRemove);
});


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

function initialExpand () {
	if (!folderEl) return;
	// allow to render all children
	setTimeout(() => toggle(true, true), 200);
}

function toggle (forceOpen, noAnim) {
	if (!folderEl) return;
	let from = '-42px', to = `-${folderEl.getBoundingClientRect().height}px`;
	expanded = forceOpen === true ? true : !expanded;
	if (!expanded) [from, to] = [to, from];
	if (noAnim) folderEl.style.marginTop = to;
	else animate(folderEl, {marginTop: from}, {marginTop: to});

	folder.open = expanded;
	if (forceOpen !== true) {
		const docked = $dockedFolders;
		const idx = docked.findIndex(d => d.id === folder.id);
		docked[idx].open = expanded;
		saveDockedFolders(docked);
	}
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
