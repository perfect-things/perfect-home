<div class="folders">
	{#each $options.folders as folder}
		{#if folder.id}
			<Folder folder="{folder}" />
		{/if}
	{/each}
</div>


<script>
import Folder from './folder';
import {options} from '../store';
</script>
