<svelte:window on:popstate={onpopstate}/>

<main class="bookmarks"
	class:is-sorting="{$wasSorted}"
	class:no-labels="{!$options.showLabels}">
	{#if $items.length}
		{#each $items as item (item.id)}
			<Tile item="{item}" />
		{/each}
	{/if}
</main>


<script>
import { Tile } from '../tile';
import { onMount } from 'svelte';
import { getSubTree, moveBookmark, injectCss, EVENT, clone, objectsMoreLessTheSame, initialLoad,
	options, items, currentFolder, itemsLoaded,	wasSorted } from '../lib';
import { default as Sortable } from 'sortablejs';
let oldProps;

onMount(() => {
	new Sortable(document.querySelector('.bookmarks'), {
		group: 'bookmarks',
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
	});
	EVENT.on(EVENT.settings.loaded, init);
	EVENT.on(EVENT.bookmark.added, refresh);
	EVENT.on(EVENT.bookmark.removed, refresh);
	EVENT.on(EVENT.document.clicked, focusBody);
});

function init () {
	$currentFolder = history.state && history.state.id || $options.rootFolder;
	options.subscribe(optionsChanged);
	currentFolder.subscribe(folderChanged);
}

function refresh () {
	readFolder($currentFolder);
}

function focusBody (e) {
	if (e.target.closest('.modal') || e.target.closest('.settings-pane')) return;
	document.body.focus();
}

function optionsChanged (props) {
	if (!props) return;
	if (objectsMoreLessTheSame(props, oldProps)) return;
	oldProps = clone(props);
	document.documentElement.style.setProperty('--grid-max-width', props.gridMaxWidth + 'px');
	document.documentElement.style.setProperty('--icon-width', props.iconWidth + 'px');
	document.documentElement.style.setProperty('--icon-height', props.iconHeight + 'px');
	document.documentElement.style.setProperty('--grid-gap', props.gridGap + 'px');

	document.documentElement.style.setProperty('--color-text', props.pageColor);
	document.documentElement.style.setProperty('--color-background', props.pageBg);
	document.documentElement.style.setProperty('--animation-speed', props.animSpeed + 'ms');
	injectCss(props.themeCSS, 'ThemeCSS');
	injectCss(props.css);
}


function onsort (e) {
	const isInMain = e.item.closest('.bookmarks');
	if (isInMain) moveBookmark(e.item.dataset.id, { index: e.newIndex, parentId: $currentFolder });
}


function onpopstate (e) {
	if (e.state) $currentFolder = e.state.id;
}

function folderChanged (folderId) {
	$itemsLoaded = false;
	if (!history.state || !history.state.id || history.state.id !== folderId) {
		const fn = (folderId === $options.rootFolder) ? 'replaceState' : 'pushState';
		window.history[fn]({ id: folderId }, document.title, '');
	}
	readFolder(folderId);
}


function readFolder (id) {
	getSubTree(id)
		.then((_items = []) => {
			$items = _items;
			$itemsLoaded = true;
			setTimeout(() => $initialLoad = false, 300);
		});
}

</script>
