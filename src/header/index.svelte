<button class="icon-btn btn-search" title="Search (Meta+P)" on:click|stopPropagation="{search}">
	<svg style="fill:currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px"><path d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z"/></svg>
</button>

<header>
	{#if $itemsLoaded && $currentFolder !== $options.rootFolder}
		<button class="icon-btn btn-back" title="Go back" on:click="{goBack}">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z" style="fill:currentColor"/></svg>
		</button>
	{/if}
	<h1 class="title">
		{#if $itemsLoaded}
			{#if !$items.length}
			<p>
				Add some links to
				"<b>{$currentFolderTitle}</b>"
				folder in your bookmarks.
			</p>
			{:else if $currentFolderTitle}
				{$currentFolderTitle}
			{/if}
		{/if}
	</h1>
</header>

<script>
import {EVENT, items, options, currentFolder, currentFolderTitle, itemsLoaded} from '../lib';

function goBack () {
	history.back();
}

function search () {
	EVENT.fire(EVENT.search.toggle);
}

</script>
