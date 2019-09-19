<svelte:window on:popstate={onpopstate}/>

<Palette data={allItems} />

<main class="bookmarks {folderSwitching ? 'folder-switching' : ''}">
	{#if $items.length}
		{#each $items as item}
			<Tile item="{item}" />
		{/each}
	{/if}
</main>


<script>
import Tile from '../tile';
import Palette from '../palette';
import {onMount} from 'svelte';
import {options, items, rootFolderTitle, currentFolder, currentFolderTitle, itemsLoaded} from '../store';
import {getSubTree, getSettings, updateIndexes, getAllItems, getFolderTitle} from '../lib';
import Sortable from 'sortablejs';

let folderSwitching = false;
let allItems = [];

function updateTitles () {
	getFolderTitle($options.rootFolder).then(title => rootFolderTitle.set(title));
	getFolderTitle($currentFolder).then(title => currentFolderTitle.set(title));
}

function optionsChanged (props) {
	currentFolder.set(props.rootFolder);
	setTimeout(updateTitles, 200);
	document.documentElement.style.setProperty('--columns', props.columns);
	document.documentElement.style.setProperty('--icon-width', props.iconWidth + 'px');
	document.documentElement.style.setProperty('--icon-height', props.iconHeight + 'px');
	document.documentElement.style.setProperty('--grid-gap', props.gridGap + 'px');

	document.documentElement.style.setProperty('--color', props.pageColor);
	document.documentElement.style.setProperty('--bg', props.pageBg);
}


function onsort (e) {
	updateIndexes(e.item.dataset.id, e.newIndex);
}

function onpopstate (e) {
	if (e.state) $currentFolder = e.state.id;
}

function folderChanged (folderId) {
	updateTitles();
	let id = folderId || $options.rootFolder;

	if (!history.state || !history.state.id || history.state.id !== folderId) {
		const fn = (id === $options.rootFolder) ? 'replaceState' : 'pushState';
		window.history[fn]({ id }, document.title, '');
	}
	folderSwitching = true;
	getSubTree(id)
		.then(tree => {
			if (!tree || !tree.length) return;
			setTimeout(() => {
				$items = tree[0].children;
				folderSwitching = false;
				$itemsLoaded = true;
			}, 100);
		});
}


onMount(() => {
	new Sortable(document.querySelector('.bookmarks'), {
		animation: 150,
		ghostClass: 'sortable-ghost',
		onStart: e => e.item.classList.add('sortable-plate'),
		onEnd: e => e.item.classList.remove('sortable-plate'),
		onSort: onsort
	});

	getAllItems().then(all => allItems = all);
	getSettings().then(stored => {
		options.set(Object.assign({}, $options, stored.settings));

		options.subscribe(optionsChanged);
		currentFolder.subscribe(folderChanged);
		onpopstate(history);
	});

});
</script>
