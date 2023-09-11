<SettingsBlock collapsed title="Reset">
	<small>This will reset the customization settings to their default values. It will not change the thumbnails cache.</small>
	<div class="settings-row">
		<button type="button" class="btn btn-reset" on:click="{reset}">Reset to defaults</button>
	</div>

	<small>This will clear all stored items: options and thumbnails cache.</small>
	<div class="settings-row">
		<button type="button" class="btn btn-clear danger" on:click="{purge}">Clear cache</button>
	</div>
</SettingsBlock>


<script>
import SettingsBlock from './settings-block';
import { clearCache, options, defaultOptions } from '../lib';

function reset () {
	options.set($defaultOptions);
}


function purge () {
	const res = window.confirm('Are you sure you wish to purge all cache?\n(Make sure you backed up your settings)');
	if (res) clearCache().then(() => location.reload());
}

</script>
