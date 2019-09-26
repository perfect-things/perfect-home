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
import {options, items, rootFolderTitle, currentFolder, currentFolderTitle, itemsLoaded, thumbs} from '../store';
import {getSubTree, getSettings, updateIndexes, getAllItems, getFolderTitle, injectCss, getThumbs, saveThumbs} from '../lib';
import Sortable from 'sortablejs';

let folderSwitching = false;
let allItems = [];

function updateTitles () {
	getFolderTitle($options.rootFolder).then(title => rootFolderTitle.set(title));
	getFolderTitle($currentFolder).then(title => currentFolderTitle.set(title));
}

function optionsChanged (props) {
	if (!props) return;
	currentFolder.set(props.rootFolder);
	updateTitles();
	document.documentElement.style.setProperty('--columns', props.columns);
	document.documentElement.style.setProperty('--icon-width', props.iconWidth + 'px');
	document.documentElement.style.setProperty('--icon-height', props.iconHeight + 'px');
	document.documentElement.style.setProperty('--grid-gap', props.gridGap + 'px');

	document.documentElement.style.setProperty('--color', props.pageColor);
	document.documentElement.style.setProperty('--bg', props.pageBg);
	const style = document.querySelector('#CustomStyle');
	if (style) style.remove();
	injectCss(props.css);
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
			}, 150);
		})
		.catch(e => console.error(e));
}


onMount(() => {
	new Sortable(document.querySelector('.bookmarks'), {
		animation: 200,
		ghostClass: 'sortable-ghost',
		onStart: e => e.item.classList.add('sortable-plate'),
		onEnd: e => e.item.classList.remove('sortable-plate'),
		onSort: onsort
	});

	getAllItems().then(all => allItems = all);
	getThumbs().then(_thumbs => {
		if (_thumbs) thumbs.set(_thumbs);
		thumbs.subscribe(saveThumbs);
	});
	getSettings().then(stored => {
		options.set(Object.assign({}, $options, stored));

		options.subscribe(optionsChanged);
		currentFolder.subscribe(folderChanged);
		onpopstate(history);
	});

});
</script>
