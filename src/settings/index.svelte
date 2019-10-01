<button
	title="Settings"
	class="icon-btn btn-settings {isVisible ? 'open' : ''}"
	on:click="{() => isVisible = !isVisible}">
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -256 1792 1792"><g transform="matrix(1,0,0,-1,121.49153,1285.4237)"><path d="m 1024,640 q 0,106 -75,181 -75,75 -181,75 -106,0 -181,-75 -75,-75 -75,-181 0,-106 75,-181 75,-75 181,-75 106,0 181,75 75,75 75,181 z m 512,109 V 527 q 0,-12 -8,-23 -8,-11 -20,-13 l -185,-28 q -19,-54 -39,-91 35,-50 107,-138 10,-12 10,-25 0,-13 -9,-23 -27,-37 -99,-108 -72,-71 -94,-71 -12,0 -26,9 l -138,108 q -44,-23 -91,-38 -16,-136 -29,-186 -7,-28 -36,-28 H 657 q -14,0 -24.5,8.5 Q 622,-111 621,-98 L 593,86 q -49,16 -90,37 L 362,16 Q 352,7 337,7 323,7 312,18 186,132 147,186 q -7,10 -7,23 0,12 8,23 15,21 51,66.5 36,45.5 54,70.5 -27,50 -41,99 L 29,495 Q 16,497 8,507.5 0,518 0,531 v 222 q 0,12 8,23 8,11 19,13 l 186,28 q 14,46 39,92 -40,57 -107,138 -10,12 -10,24 0,10 9,23 26,36 98.5,107.5 72.5,71.5 94.5,71.5 13,0 26,-10 l 138,-107 q 44,23 91,38 16,136 29,186 7,28 36,28 h 222 q 14,0 24.5,-8.5 Q 914,1391 915,1378 l 28,-184 q 49,-16 90,-37 l 142,107 q 9,9 24,9 13,0 25,-10 129,-119 165,-170 7,-8 7,-22 0,-12 -8,-23 -15,-21 -51,-66.5 -36,-45.5 -54,-70.5 26,-50 41,-98 l 183,-28 q 13,-2 21,-12.5 8,-10.5 8,-23.5 z" style="fill:currentColor"/></g></svg>
</button>

<div class="settings-pane {isVisible ? '' : 'hidden'}">
	<h1>Settings</h1>
	<div class="settings-form {isVisible ? '' : 'hidden'}">
		<form on:change="{onchange}">
		<label>Main folder</label>
		<div class="settings-row">
			<select name="rootfolder" bind:value="{$options.rootFolder}">
				{#each folders as folder}
					<option value="{folder.id}">{folder.title}</option>
				{/each}
			</select>
		</div>
		<label>Docked folders</label>
		{#each $options.folders as dockedFolder}
			<div class="settings-row">
				<select bind:value="{dockedFolder}">
					<option value="">None</option>
					{#each folders as folder}
						<option value="{folder.id}">{folder.title}</option>
					{/each}
				</select>

				<button
					class="btn xbtn"
					type="button"
					on:click|stopPropagation="{() => delFolder(dockedFolder)}">&times;
				</button>
			</div>
		{/each}
		<div class="settings-row">
			<button class="btn" type="button" on:click="{addFolder}">Add Docked Folder</button>
		</div>


		<div class="settings-row">
			<label>Max number of columns</label>
			<input type="number" bind:value="{$options.columns}">
		</div>

		<div class="settings-row">
			<label>Gaps</label>
			<input type="number" bind:value="{$options.gridGap}">
		</div>

		<div class="settings-row">
			<label>Tile size</label>
			<div class="flex-spacer"></div>
			<input type="number" bind:value="{$options.iconWidth}">
			<input type="number" bind:value="{$options.iconHeight}">
		</div>

		<div class="settings-row">
			<label>Text color</label>
			<div class="flex-spacer"></div>
			<input type="text" bind:value="{$options.pageColor}">
			<input type="color" bind:value="{$options.pageColor}">
		</div>

		<div class="settings-row">
			<label>Background</label>
			<div class="flex-spacer"></div>
			<input type="text" bind:value="{$options.pageBg}">
			<input type="color" bind:value="{$options.pageBg}">
		</div>

		<label>Custom CSS</label>
		<div class="settings-row">
			<textarea bind:value="{$options.css}"></textarea>
		</div>
		</form>

		<hr>

		<div class="settings-row buttons-row">
			<button type="button" class="btn btn-reset" on:click="{reset}">Reset to defaults</button>
			<small>This will reset the above settings to their default values. It will not change the thumbnails cache.</small>
		</div>

		<hr>

		<div class="settings-row buttons-row">
			<a class="btn btn-half btn-export" download="perfect-home-settings.json" href="{settingsBlob}">Export</a>
			<div class="btn btn-half btn-import" on:click="{() => settingsInput.click()}">
				Import
				<input type="file" accept="application/json"
					bind:this="{settingsInput}"
					on:change="{onSettingsSelect}">
			</div>
			<small>You can Export settings with thumbnails to a json file to backup your configuration.
			That file can then be imported in the same version of this Firefox extension.</small>
		</div>

		<hr>

		<div class="settings-row buttons-row">
			<button type="button" class="btn btn-clear" on:click="{clearCache}">Clear cache</button>
			<small>This will clear all stored items: options and thumbnails cache.</small>
		</div>

	</div>
</div>

<script>
import {onMount} from 'svelte';
import {options, defaultOptions, thumbs} from '../store';
import {getAllItems, saveSettings, getSettings, clearCache} from '../lib';

let isVisible = false;
let folders = [];
let settingsBlob, settingsInput;

onMount(() => {
	getAllItems().then(items => {
		folders = items.filter(item => item.type === 'folder');
	});
	document.addEventListener('click', onDocClick);
});


$: {
	const exp = JSON.stringify({ options: $options, thumbs: $thumbs });
	settingsBlob = 'data:application/json;charset=utf-8,' + encodeURIComponent(exp);
}

function setOptions (json) {
	options.set(json);
	saveSettings(json);
}

function addFolder () {
	const opts = $options;
	opts.folders.push('');
	setOptions(opts);
}


function delFolder (id) {
	const opts = $options;
	opts.folders.splice(opts.folders.indexOf(id), 1);
	setOptions(opts);
}


function onSettingsSelect (e) {
	const reader = new FileReader();
	reader.onload = ev => {
		let json;
		try { json = JSON.parse(ev.target.result); }
		catch (er) {/* no-empty: 0 */ }
		if (!json) alert('Incorrect settings file!');
		thumbs.set(json.thumbs);
		setOptions(json.options);
	};
	reader.readAsText(e.target.files[0]);
}


function reset () {
	setOptions($defaultOptions);
}

function onDocClick (e) {
	if (e.target.closest('.settings-pane,.btn-settings')) return;
	if (!isVisible) return;
	isVisible = false;
}


function onchange () {
	saveSettings($options)
		.then(getSettings)
		.then(res => res && options.set(res));
}


</script>
