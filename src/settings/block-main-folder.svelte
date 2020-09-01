<SettingsBlock title="Main folder">
	<small>This is the primary navigable list of bookmarks.</small>

	<div class="settings-row">
		<div class="select-wrap">
			<select name="rootfolder" bind:value="{$options.rootFolder}" aria-label="Main folder">
				{#each folders as folder}
					<option value="{folder.id}">{folder.title}</option>
				{/each}
			</select>
		</div>
	</div>
</SettingsBlock>


<script>
import {options} from '../lib';
import SettingsBlock from './settings-block';

export let folders = [];

</script>
