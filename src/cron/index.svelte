<script>
import {onMount} from 'svelte';
import {getAllItems, getThumbs, saveThumbs} from '../lib';

const TIMEOUT = 10000;

onMount(() => {
	setTimeout(purgeThumbs, TIMEOUT);
});


/**
 * Delete dangling thumbnails from cache.
 * (Bookmarks removed and then "undo-ed") will cause dangling thumbs also)
 * (because the ID changes)
 */
async function purgeThumbs () {
	const thumbs = await getThumbs();
	const items = await getAllItems();
	const itemsIds = items.map(i => i.id);
	let count = 0;
	for (let thumb in thumbs) {
		if (itemsIds.includes(thumb)) continue;
		delete thumbs[thumb];
		count += 1;
	}
	await saveThumbs(thumbs);
	if (count) console.log(`Purged ${count} unused thumbnail${count > 1 ? 's' : ''}.`);
}

</script>
