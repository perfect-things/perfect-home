<div class="folder folder-{id}" data-id="{id}" bind:this="{folderEl}">
	<h2 class="folder-titlebar" on:click="{toggle}">
		<span class="folder-title">{title}</span>
		<span class="folder-badge">{items.length || ''}</span>
	</h2>
	<div class="folder-items" bind:this="{folderItems}">
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
import {getSubTree, getFolderTitle, moveBookmark} from '../lib';
import Sortable from 'sortablejs';

export let id;
let folderEl;
let title = '';
let items = [];
let expanded = false;
let folderItems;


$: {
	if (id) {
		getFolderTitle(id).then(_title => title = _title);
		readFolder(id);
	}
}


onMount(() => {
	new Sortable(folderItems, {
		group: 'bookmarks',
		animation: 200,
		ghostClass: 'sortable-ghost',
		onStart: e => e.item.classList.add('sortable-plate'),
		onEnd: e => e.item.classList.remove('sortable-plate'),
		onSort: onsort,
		onAdd: addremove,
		onRemove: addremove,
	});

});


function addremove () {
	toggle(true);
}

function onsort (e) {
	const isInFolder = e.item.closest('.folder-items');
	if (isInFolder) moveBookmark(e.item.dataset.id, {parentId: id, index: e.newIndex});
}

function toggle (recalc) {
	let marginTop = 42;
	expanded = recalc === true ? true : !expanded;
	if (expanded) marginTop = folderEl.getBoundingClientRect().height;
	folderEl.style.marginTop = `-${marginTop}px`;
}

function readFolder () {
	return getSubTree(id)
		.then(tree => {
			if (!tree || !tree.length) return;
			items = tree[0].children.filter(i => i.type !== 'folder');
		})
		.catch(e => console.error(e));
}

</script>
