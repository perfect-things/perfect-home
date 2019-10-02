<div class="folder" bind:this="{folderEl}">
	<h2 class="folder-titlebar" on:click="{toggle}">
		<span class="folder-title">{title}</span>
		<span class="folder-badge">{items.length || ''}</span>
	</h2>
	{#if items && items.length}
		{#each items as item}
			<a class="folder-item" href="{item.url}" title="{item.title}">
				<img src="{getFavicon(item.url)}" alt="{item.title}">
				<span>{item.title}</span>
			</a>
		{/each}
	{:else}
		<span class="folder-empty">Folder is empty</span>
	{/if}
</div>


<script>
import {getSubTree, getFolderTitle} from '../lib';

export let id;
let folderEl;
let title = '';
let items = [];
let expanded = false;
const favIconService = 'https://www.google.com/s2/favicons?domain=';


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


function getFavicon (url) {
	let urlObj;
	try { urlObj = new URL(url); }
	catch (e) {/**/}
	return favIconService + (urlObj.host || '');
}


function toggle () {
	let marginTop = 42;
	if (!expanded) marginTop = folderEl.getBoundingClientRect().height;
	folderEl.style.marginTop = `-${marginTop}px`;
	expanded = !expanded;
}


</script>
