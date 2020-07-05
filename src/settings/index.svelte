<SettingsPane>
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

	<SettingsBlock title="Docked folders">
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



	<SettingsBlock collapsed title="Customize">
		<div class="settings-row">
			<label for="gridMaxWidth">Max grid width</label>
			<input id="gridMaxWidth" type="number" bind:value="{$options.gridMaxWidth}">
		</div>

		<div class="settings-row">
			<label for="gridGap">Gaps</label>
			<input id="gridGap" type="number" bind:value="{$options.gridGap}">
		</div>

		<div class="settings-row">
			<label id="tile-size">Tile size</label>
			<div class="flex-spacer"></div>
			<input aria-labelledby="tile-size" aria-label="Tile width" type="number" bind:value="{$options.iconWidth}">
			<input aria-labelledby="tile-size" aria-label="Tile height" type="number" bind:value="{$options.iconHeight}">
		</div>

		<div class="settings-row">
			<label for="pageColor">Text color</label>
			<div class="flex-spacer"></div>
			<input aria-label="Select text color" type="color" bind:value="{$options.pageColor}">
			<input aria-label="Enter text color hex" id="pageColor" type="text" bind:value="{$options.pageColor}">
		</div>

		<div class="settings-row">
			<label for="pageBg">Background</label>
			<div class="flex-spacer"></div>
			<input aria-label="Select background color" type="color" bind:value="{$options.pageBg}">
			<input aria-label="Enter background color hex" id="pageBg" type="text" bind:value="{$options.pageBg}">
		</div>

		<div class="settings-row">
			<label for="showLabels">Show labels</label>
			<div class="flex-spacer"></div>
			<Toggle id="showLabels" bind:value="{$options.showLabels}"/>
		</div>
	</SettingsBlock>


	<SettingsBlock collapsed title="Custom CSS">
		<small>This allows you to fully customize the page.
			See <a href="https://github.com/perfect-things/perfect-home/blob/master/customization-tutorial.md" target="_blank">
				this tutorial</a> for some examples.
		</small>

		<small>The CSS validator used here is very basic, and cannot ensure the 100% correctness.<br>
			Please, validate your code <a href="https://jigsaw.w3.org/css-validator/#validate_by_input" target="_blank" title="CSS Validator">here</a>.
		</small>

		<div class="settings-row">
			<textarea bind:value="{$options.css}" on:input="{validateCss}" aria-label="Custom CSS"></textarea>
		</div>
	</SettingsBlock>


	<SettingsBlock collapsed title="Reset">
		<small>This will reset the customization settings to their default values. It will not change the thumbnails cache.</small>
		<div class="settings-row">
			<button type="button" class="btn btn-reset" on:click="{reset}">Reset to defaults</button>
		</div>
	</SettingsBlock>


	<ImportExport />


	<SettingsBlock collapsed title="Purge">
		<small>This will clear all stored items: options and thumbnails cache.</small>
		<div class="settings-row">
			<button type="button" class="btn btn-clear danger" on:click="{purge}">Clear cache</button>
		</div>
	</SettingsBlock>
</SettingsPane>

<script>
import {onMount} from 'svelte';
import {options, defaultOptions, dockedFolders} from '../store';
import {EVENT, getAllItems, clearCache, validateCustomCss, getSettings, saveSettings} from '../lib';
import ImportExport from './import-export';
import SettingsPane from './settings-pane';
import SettingsBlock from './settings-block';
import Toggle from '../svelte-toggle';
let folders = [];

onMount(() => {
	getAllItems()
		.then(items => folders = items.filter(item => item.type === 'folder'))
		.then(loadSettings);
});


function loadSettings () {
	getSettings().then(stored => {
		options.set(Object.assign({}, $defaultOptions, stored));
		options.subscribe(saveSettings);
		EVENT.fire(EVENT.settings.loaded);
	});
}


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

function reset () {
	options.set($defaultOptions);
}


function purge () {
	const res = window.confirm('Are you sure you wish to purge all cache?\n(Make sure you backed up your settings)');
	if (res) clearCache().then(() => location.reload());
}


function validateCss (ev) {
	const el = ev.target;
	const text = el.value || '';

	const res = validateCustomCss(text);
	el.setCustomValidity(res ? '' : 'Check your CSS!');
}

</script>
