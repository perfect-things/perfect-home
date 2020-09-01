<SettingsBlock collapsed title="Import/Export">
	<small>You can Export settings with thumbnails to a json file to backup your configuration. That file can then be imported in the same version of this Firefox extension.</small>
	<div class="settings-row">

		<a href="#export"
			class="btn btn-export"
			tabindex="0"
			download="perfect-home-settings.json"
			on:click="{exportSettings}">Export</a>

		<div class="btn btn-import"
			tabindex="0"
			on:keypress="{importClick}"
			on:click="{importClick}">
				Import
				<input type="file" accept="application/json"
					tabindex="-1"
					bind:this="{settingsInput}"
					on:change="{importSettings}">
		</div>
	</div>
</SettingsBlock>


<script>
import {EVENT, options, thumbs, dockedFolders} from '../lib';
import SettingsBlock from './settings-block';
let settingsInput;


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

function importClick (e) {
	if (e.key === 'Enter' || e.key === ' ' || e.type === 'click') settingsInput.click();
}
</script>
