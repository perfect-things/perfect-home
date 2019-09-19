<header>
	{#if $currentFolder !== $options.rootFolder}
		<button class="icon-btn btn-back" title="Go back" on:click="{goBack}">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z" style="fill:currentColor"/></svg>
		</button>
	{/if}
	<h1 class="title">
		{#if !$items.length && $itemsLoaded}
		<p>
			Add some links to
			<b>{$rootFolderTitle}</b>
			folder in your bookmarks.
		</p>
		{:else}
			{$currentFolderTitle}
		{/if}
	</h1>
</header>

<script>
import {items, options, currentFolder, rootFolderTitle, currentFolderTitle, itemsLoaded} from '../store';

function goBack () {
	history.back();
}

</script>
