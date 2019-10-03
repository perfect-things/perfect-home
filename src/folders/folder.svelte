<div class="folder folder-{id}" data-id="{id}" bind:this="{folderEl}">
	<h2 class="folder-titlebar" on:click="{toggle}">
		<span class="folder-title">{title}</span>
		<span class="folder-badge">{items.length || ''}</span>
	</h2>
	<div class="folder-items" bind:this="{folderItems}">
		{#if items && items.length}
			{#each items as item}
				<a class="item" href="{item.url}" title="{item.title}" data-id="{item.id}">
					<span class="item-thumb" style="{setStyle(item)}"></span>
					<span class="item-title">{item.title}</span>
				</a>
			{/each}
		{:else}
			<span class="folder-empty">Folder is empty</span>
		{/if}
	</div>
</div>


<script>
import {onMount} from 'svelte';
import {thumbs} from '../store';
import {getSubTree, getFolderTitle, getFavicon, moveBookmark} from '../lib';
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
		getSubTree(id)
			.then(tree => {
				if (!tree || !tree.length) return;
				items = tree[0].children.filter(i => i.type !== 'folder');
			})
			.catch(e => console.error(e));
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
	});

});


function onsort (e) {
	const isInFolder = e.item.closest('.folder-items');
	if (isInFolder) moveBookmark(e.item.dataset.id, {parentId: id, index: e.newIndex});
}

function setStyle (item) {
	let url;
	if ($thumbs && $thumbs[item.id]) url = $thumbs[item.id];
	else url = getFavicon(item.url);
	return `background-image: url("${url}")`;
}


function toggle () {
	let marginTop = 42;
	if (!expanded) marginTop = folderEl.getBoundingClientRect().height;
	folderEl.style.marginTop = `-${marginTop}px`;
	expanded = !expanded;
}


</script>
