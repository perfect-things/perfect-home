<div class="folders">
	{#if $options.folders.length && $options.folders[0] }
		{#each $options.folders as folder}
			{#if folder}
				<Folder folder="{folder}" />
			{/if}
		{/each}
	{/if}
</div>


<script>
import Folder from './folder';
import {options} from '../store';
</script>
