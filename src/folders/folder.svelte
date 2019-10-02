<div class="folder" bind:this="{folderEl}">
	<h2 class="folder-titlebar" on:click="{toggle}">
		<span class="folder-title">{title}</span>
		<span class="folder-badge">{items.length || ''}</span>
	</h2>
	{#if items && items.length}
		{#each items as item}
			<a class="folder-item" href="{item.url}" title="{item.title}" data-id="{item.id}">
				<div class="item-thumb" style="{setStyle(item)}"></div>
				<span>{item.title}</span>
			</a>
		{/each}
	{:else}
		<span class="folder-empty">Folder is empty</span>
	{/if}
</div>


<script>
import {thumbs} from '../store';
import {getSubTree, getFolderTitle, getFavicon} from '../lib';

export let id;
let folderEl;
let title = '';
let items = [];
let expanded = false;


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
