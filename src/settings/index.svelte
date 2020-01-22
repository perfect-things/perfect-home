<button
	title="Settings"
	class="icon-btn btn-settings"
	class:hidden="{!isVisible}"
	bind:this="{settingsBtn}"
	on:keydown="{e => trapfocus(e, 'first')}"
	on:click="{toggle}">
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -256 1792 1792" aria-label="Cog"><g transform="matrix(1,0,0,-1,121.49153,1285.4237)"><path aria-label="Cog" d="m 1024,640 q 0,106 -75,181 -75,75 -181,75 -106,0 -181,-75 -75,-75 -75,-181 0,-106 75,-181 75,-75 181,-75 106,0 181,75 75,75 75,181 z m 512,109 V 527 q 0,-12 -8,-23 -8,-11 -20,-13 l -185,-28 q -19,-54 -39,-91 35,-50 107,-138 10,-12 10,-25 0,-13 -9,-23 -27,-37 -99,-108 -72,-71 -94,-71 -12,0 -26,9 l -138,108 q -44,-23 -91,-38 -16,-136 -29,-186 -7,-28 -36,-28 H 657 q -14,0 -24.5,8.5 Q 622,-111 621,-98 L 593,86 q -49,16 -90,37 L 362,16 Q 352,7 337,7 323,7 312,18 186,132 147,186 q -7,10 -7,23 0,12 8,23 15,21 51,66.5 36,45.5 54,70.5 -27,50 -41,99 L 29,495 Q 16,497 8,507.5 0,518 0,531 v 222 q 0,12 8,23 8,11 19,13 l 186,28 q 14,46 39,92 -40,57 -107,138 -10,12 -10,24 0,10 9,23 26,36 98.5,107.5 72.5,71.5 94.5,71.5 13,0 26,-10 l 138,-107 q 44,23 91,38 16,136 29,186 7,28 36,28 h 222 q 14,0 24.5,-8.5 Q 914,1391 915,1378 l 28,-184 q 49,-16 90,-37 l 142,107 q 9,9 24,9 13,0 25,-10 129,-119 165,-170 7,-8 7,-22 0,-12 -8,-23 -15,-21 -51,-66.5 -36,-45.5 -54,-70.5 26,-50 41,-98 l 183,-28 q 13,-2 21,-12.5 8,-10.5 8,-23.5 z" style="fill:currentColor"/></g></svg>
</button>

<div class="settings-pane" class:hidden="{!isVisible}" tabindex="-1" bind:this="{settingsPane}">
	<h1>Settings</h1>
	<div class="settings-form" style="display: none" bind:this="{settingsForm}">
		<h2>Main folder</h2>
		<small>This is the primary navigable list of bookmarks.</small>

		<div class="settings-row">
			<div class="select-wrap">
				<select name="rootfolder" bind:value="{$options.rootFolder}">
					{#each folders as folder}
						<option value="{folder.id}">{folder.title}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="settings-row">
			<label>Max grid width</label>
			<input type="number" bind:value="{$options.gridMaxWidth}">
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
			<input type="color" bind:value="{$options.pageColor}">
			<input type="text" bind:value="{$options.pageColor}">
		</div>

		<div class="settings-row">
			<label>Background</label>
			<div class="flex-spacer"></div>
			<input type="color" bind:value="{$options.pageBg}">
			<input type="text" bind:value="{$options.pageBg}">
		</div>


		<h2>Custom CSS</h2>
		<small>This allows you to fully customize the page.
			See <a href="https://github.com/tborychowski/perfect-home/blob/master/customization-tutorial.md" target="_blank">
				this tutorial</a> for some examples.
		</small>

		<small>The CSS validator used here is very basic, and cannot ensure the 100% correctness.<br>
			Please, validate your code <a href="https://jigsaw.w3.org/css-validator/#validate_by_input" target="_blank">here</a>.
		</small>

		<div class="settings-row">
			<textarea bind:value="{$options.css}" on:input="{validateCss}"></textarea>
		</div>


		<h2>Docked folders</h2>
		<small>These folders will be docked to the bottom.</small>

		{#each $dockedFolders as dockedFolder}
			<div class="settings-row">
				<div class="select-wrap">
					<select bind:value="{dockedFolder.id}" on:change="{() => onDockedFoldersChange(dockedFolder.id)}">
						<option value="">None</option>
						{#each folders as folder}
							<option value="{folder.id}">{folder.title}</option>
						{/each}
					</select>
				</div>
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


		<h2>Reset</h2>
		<small>This will reset the above settings to their default values. It will not change the thumbnails cache.</small>
		<div class="settings-row">
			<button type="button" class="btn btn-reset" on:click="{reset}">Reset to defaults</button>
		</div>


		<h2>Import/Export</h2>
		<small>You can Export settings with thumbnails to a json file to backup your configuration. That file can then be imported in the same version of this Firefox extension.</small>
		<div class="settings-row">

			<a href="#export"
				class="btn btn-half btn-export"
				tabindex="0"
				download="perfect-home-settings.json"
				on:click="{exportSettings}">Export</a>

			<div class="btn btn-half btn-import"
				tabindex="0"
				on:click="{() => settingsInput.click()}">
					Import
					<input type="file" accept="application/json"
						tabindex="-1"
						bind:this="{settingsInput}"
						on:change="{importSettings}">
			</div>
		</div>


		<h2>Purge</h2>
		<small>This will clear all stored items: options and thumbnails cache.</small>
		<div class="settings-row">
			<button type="button"
				class="btn btn-clear danger"
				on:keydown="{e => trapfocus(e, 'last')}"
				on:click="{purge}">Clear cache</button>
		</div>

	</div>
</div>

<script>
import {onMount} from 'svelte';
import {options, defaultOptions, thumbs, dockedFolders} from '../store';
import {EVENT, getAllItems, clearCache, validateCustomCss} from '../lib';


let isVisible = false;
let folders = [];
let settingsPane, settingsForm, settingsInput, settingsBtn;


onMount(() => {
	getAllItems().then(items => {
		folders = items.filter(item => item.type === 'folder');
	});
	settingsPane.addEventListener('transitionend', ontransitionend);
	EVENT.on(EVENT.document.clicked, onDocClick);
});


function toggle (e) {
	const focusBtn = (!e.screenX && !e.screenY);
	isVisible ? close(focusBtn) : open();
}

function open () {
	settingsForm.style = '';
	isVisible = true;
}

function close (focusBtn) {
	isVisible = false;
	if (focusBtn) settingsBtn.focus();
}

function ontransitionend () {
	if (!isVisible) settingsForm.style.display = 'none';
}


function exportSettings (e) {
	const exp = JSON.stringify({
		options: $options,
		dockedFolders: $dockedFolders,
		thumbs: $thumbs,
	});
	e.target.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(exp);
}

function importSettings (e) {
	const reader = new FileReader();
	reader.onload = ev => {
		let json;
		try { json = JSON.parse(ev.target.result); }
		catch (er) {/* no-empty: 0 */ }
		if (!json) alert('Incorrect settings file!');
		else {
			if (json.thumbs) thumbs.set(json.thumbs);
			if (json.dockedFolder) dockedFolders.set(json.dockedFolder);
			if (json.options) options.set(json.options);
			EVENT.fire(EVENT.settings.imported);
		}
	};
	reader.readAsText(e.target.files[0]);
}

function onDockedFoldersChange (id) {
	EVENT.fire(EVENT.dockedFolders.changed, id);
}


function addFolder () {
	const docked = $dockedFolders;
	docked.push({id: '', open: false});
	dockedFolders.set(docked);
}

function delFolder (id) {
	const docked = $dockedFolders;
	const idx = docked.findIndex(f => f.id === id);
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

function onDocClick (e) {
	if (e.target.closest('.settings-pane,.btn-settings')) return;
	if (!isVisible) return;
	close();
}


function trapfocus (e, how) {
	if (!isVisible || e.key !== 'Tab') return;
	if (how === 'first' && !e.shiftKey) return;
	if (how === 'last' && e.shiftKey) return;
	e.preventDefault();
	e.target.focus();
}


function validateCss (ev) {
	const el = ev.target;
	const text = el.value || '';

	const res = validateCustomCss(text);
	el.setCustomValidity(res ? '' : 'Check your CSS!');
}

</script>
