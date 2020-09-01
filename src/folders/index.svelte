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
import {EVENT, getBookmark, dockedFolders} from '../lib';
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

/*eslint require-atomic-updates: 0 */
function checkFolders () {
	if (!settingsLoaded || !foldersLoaded) return;

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
