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
import {options} from '../store';
import {getSubTree, getFolderTitle, moveBookmark, saveSettings} from '../lib';
import Sortable from 'sortablejs';

export let folder;
let folderEl;
let folderItemsEl;
let items = [];
let expanded = false;


$: {
	if (folder && folder.id) {
		getFolderTitle(folder.id).then(title => folder.title = title);
		readFolder(folder.id);
	}
}


onMount(() => {
	new Sortable(folderItemsEl, {
		group: 'bookmarks',
		animation: 200,
		ghostClass: 'sortable-ghost',
		onStart: e => e.item.classList.add('sortable-plate'),
		onEnd: e => e.item.classList.remove('sortable-plate'),
		onSort: onsort,
		onAdd: addremove,
		onRemove: addremove,
	});
	if (folder.open) initialExpand();
});


function addremove () {
	toggle(true);
}

function onsort (e) {
	const isInFolder = e.item.closest('.folder-items');
	if (isInFolder) moveBookmark(e.item.dataset.id, {parentId: folder.id, index: e.newIndex});
}

function initialExpand () {
	// allow to render all children
	setTimeout(() => {
		folderEl.style.transitionDuration = '0s';
		toggle(true);
		// allow to expand fully before re-enabling transition
		setTimeout(() => folderEl.style.transitionDuration = '.2s', 100);
	}, 100);
}

function toggle (recalc) {
	let marginTop = 42;
	expanded = recalc === true ? true : !expanded;
	if (expanded) marginTop = folderEl.getBoundingClientRect().height;
	folderEl.style.marginTop = `-${marginTop}px`;
	folder.open = expanded;
	if (recalc !== true) saveSettings($options);
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
