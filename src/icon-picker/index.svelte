<Modal title="Icon Picker ({$options.theme})" bind:this="{modal}" cssClass="icon-picker">
	<div class="icon-picker-content">
		<div class="icon-picker-content-inner">
			{#each $themeIcons as icon}
				<a class="icon-picker-icon"
					href="{icon.imgUrl}"
					style="background-image: url('{icon.imgUrl}')"
					on:click|preventDefault="{() => selectIcon(icon)}">{icon.name}</a>
			{/each}
		</div>
	</div>
	<div class="buttons">
		<button type="button" class="btn" on:click="{close}">Close</button>
		<div class="flex-spacer"></div>
	</div>
</Modal>


<script>
import {onMount} from 'svelte';
import Modal from '../svelte-modal';
import {EVENT, themes, themeIcons, options} from '../lib';

let modal;

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
