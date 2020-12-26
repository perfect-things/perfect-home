<SettingsBlock collapsed title="Docked folders">
	<small>These folders will be docked to the bottom.</small>

	{#each $dockedFolders as dockedFolder}
		<div class="settings-row">
			<div class="select-wrap">
				<!-- svelte-ignore a11y-no-onchange -->
				<select title="Select a docked folder"
					aria-label="Docked Folders"
					bind:value="{dockedFolder.id}"
					on:change="{() => onDockedFoldersChange(dockedFolder.id)}"
				>
					<option value="">None</option>
					{#each folders as folder}
						<option value="{folder.id}">{folder.title}</option>
					{/each}
				</select>
			</div>
			<button
				title="Remove a docked folder"
				class="btn xbtn"
				type="button"
				on:click|stopPropagation="{() => delFolder(dockedFolder)}">&times;
			</button>
		</div>
	{/each}
	<div class="settings-row">
		<button class="btn" type="button" on:click="{addFolder}">Add Docked Folder</button>
	</div>
</SettingsBlock>


<script>
import SettingsBlock from './settings-block';
import {EVENT, dockedFolders} from '../lib';

export let folders = [];

function onDockedFoldersChange (id) {
	EVENT.fire(EVENT.dockedFolders.changed, id);
}


function addFolder () {
	const docked = $dockedFolders;
	docked.push({id: '', open: false});
	dockedFolders.set(docked);
}

function delFolder (folder) {
	const docked = $dockedFolders;
	const idx = docked.findIndex(f => f.id === folder.id);
	docked.splice(idx, 1);
	dockedFolders.set(docked);
}

</script>
