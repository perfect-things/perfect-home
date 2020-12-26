<SettingsBlock collapsed title="Main folder">
	<small>This is the primary navigable list of bookmarks.</small>

	<div class="settings-row">
		<div class="select-wrap">
			<!-- svelte-ignore a11y-no-onchange -->
			<select name="rootfolder" aria-label="Main folder"
				on:change="{onChange}"
				bind:value="{$options.rootFolder}">

				{#each folders as folder}
					<option value="{folder.id}">{folder.title}</option>
				{/each}
			</select>
		</div>
	</div>
</SettingsBlock>


<script>
import {options, currentFolder} from '../lib';
import SettingsBlock from './settings-block';

export let folders = [];

function onChange (e) {
	currentFolder.set(e.target.value);
}
</script>
