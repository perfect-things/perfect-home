<div class="folder folder-{folder.id}" data-id="{folder.id}" bind:this="{folderEl}">

	<button class="folder-title" on:click="{toggle}">{folder.title}</button>

	<div class="folder-items" bind:this="{folderItemsEl}">
		{#each items as item (item.id)}
			<Tile item="{item}" />
		{/each}
	</div>
</div>


<script>
import Tile from '../tile';
import {onMount, tick} from 'svelte';
import {wasSorted, dockedFolders} from '../store';
import {EVENT, getSubTree, getFolderTitle, moveBookmark, saveDockedFolders} from '../lib';
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

	EVENT.on(EVENT.bookmark.added, onBookmarkRemove);
	EVENT.on(EVENT.bookmark.removed, onBookmarkRemove);
	EVENT.on(EVENT.dockedFolders.changed, onDockedFoldersChange);

	if (folder.id) onDockedFoldersChange(folder.id);
});



function onDockedFoldersChange (id) {
	if (id !== folder.id && folder.title) return;
	getFolderTitle(folder.id).then(title => {
		if (folder.title !== title) {
			folder.title = title;
			saveDockedFolders($dockedFolders);
		}
		if (id === folder.id) readFolder();
		setTimeout(() => (folder.open ? open() : close()), 100);
		setTimeout(() => (folder.open ? open() : close()), 300);
		setTimeout(() => (folder.open ? open() : close()), 500);
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

function toggle () {
	expanded ? close() : open();
	saveDockedFolders($dockedFolders);
}

function open () {
	if (!folderEl) return;
	folderItemsEl.classList.remove('hidden');
	const folderH = folderEl.getBoundingClientRect().height;
	folderEl.style.marginTop = -folderH + 'px';
	expanded = folder.open = true;
}

function close () {
	if (!folderEl) return;
	folderEl.style.marginTop = '-42px';
	folderItemsEl.classList.add('hidden');
	expanded = folder.open = false;
}


function readFolder (id = folder.id) {
	return getSubTree(id)
		.then(tree => {
			if (!tree || !tree.length) return;
			items = tree[0].children.filter(i => i.type !== 'folder');
			return items;
		})
		.catch(e => console.error(e));
}

</script>
