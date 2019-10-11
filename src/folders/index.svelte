<div class="folders">
	{#each $dockedFolders as folder}
		{#if folder.id}
			<Folder folder="{folder}" />
		{/if}
	{/each}
</div>


<script>
import {onMount} from 'svelte';
import Folder from './folder';
import {EVENT, getBookmark} from '../lib';
import {options, dockedFolders} from '../store';
let settingsLoaded = false;
let foldersLoaded = false;

onMount(() => {
	EVENT.on(EVENT.dockedFolders.loaded, () => {
		settingsLoaded = true;
		checkFolders();
	});
	EVENT.on(EVENT.settings.loaded, () => {
		foldersLoaded = true;
		checkFolders();
	});
	EVENT.on(EVENT.settings.imported, () => {
		settingsLoaded = true;
		foldersLoaded = true;
		checkFolders();
	});
});

// backwards compatibility
/*eslint require-atomic-updates: 0 */
function checkFolders () {
	if (!settingsLoaded || !foldersLoaded) return;
	// array of strings -> array of objects
	if ($options.folders.length && typeof $options.folders[0] === 'string') {
		$options.folders = $options.folders.map(f => ({id: f}));
	}

	if (!$dockedFolders.length && $options.folders && $options.folders.length) {
		const opts = $options;
		dockedFolders.set(opts.folders);
		delete opts.folders;
		options.set(opts);
	}

	// remove from docked folders if doesn't exist in bookmarks
	if ($dockedFolders.length) {
		let folders = $dockedFolders.map(async item => {
			let bkm;
			try { bkm = await getBookmark(item.id); }
			catch (e) {/**/}
			item.exists = !!bkm;
			return item;
		});
		Promise.all(folders).then(res => {
			folders = res.filter(item => item.exists);
			dockedFolders.set(folders);
		});

	}
}


</script>
