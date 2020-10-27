<div class="settings-block" class:collapsed>
	<h2 class="settings-block-header" tabindex="0"
		on:keypress={toggle}
		on:click|preventDefault={toggle}>
		{title}
		<div class="chevron"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></div>
	</h2>
	{#if !collapsed}
		<div class="settings-block-content" transition:slide|local="{{ duration: $options.animSpeed }}">
			<slot></slot>
		</div>
	{/if}
</div>


<script>
import { slide } from 'svelte/transition';
import { options } from '../lib';
export let title = '';
export let collapsed = false;

function toggle (e) {
	if (e.type === 'keypress' && e.key !== 'Enter' && e.key !== ' ') return;
	collapsed = !collapsed;
}

</script>
