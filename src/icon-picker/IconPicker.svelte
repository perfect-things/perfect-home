<Modal title="Icon Picker ({$options.theme})" bind:this="{modal}" cssClass="icon-picker">
	<div class="icon-picker-filter">
		<svg style="fill:currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px"><path d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z"/></svg>
		<input type="search" bind:value="{filter}" placeholder="Filter">
	</div>
	<div class="icon-picker-content">
		{#if icons.length}
			<div class="icon-picker-content-inner">
				{#each icons as icon}
					<a class="icon-picker-icon"
						href="{icon.imgUrl}"
						style="background-image: url('{icon.imgUrl}')"
						on:click|preventDefault="{() => selectIcon(icon)}">{icon.name}</a>
				{/each}
			</div>
		{:else}
			<div class="icon-picker-empty">There are no icons in this theme.</div>
		{/if}
	</div>
	<div class="buttons">
		<button type="button" class="btn" on:click="{close}">Close</button>
		<div class="flex-spacer"></div>
	</div>
</Modal>


<script>
import { onMount } from 'svelte';
import { Modal } from '../svelte-modal';
import { EVENT, themes, themeIcons, options } from '../lib';

let modal;
let filter = '';

$:icons = filter ? $themeIcons.filter(i => i.name.includes(filter)) : $themeIcons;

onMount(() => {
	EVENT.on(EVENT.iconPicker.open, open);
});


function selectIcon (icon) {
	EVENT.fire(EVENT.iconPicker.picked, icon);
	modal.close();
}

function open (openedBy) {
	themes.load();
	modal.open(openedBy);
}


function close () {
	modal.close();
}

</script>
