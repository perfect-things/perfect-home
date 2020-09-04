<SettingsBlock collapsed title="Privacy">
	<small>This allows you to restrict the extension to not query external servers.
		See <a href="https://github.com/perfect-things/perfect-home#privacy" target="_blank">more info on the privacy settings</a>.

		<ul>
			<li><b>Google</b> is used to fetch favicons that show up in docked folders and search
			<li><b>Github</b> is used to fetch themes & theme icons
		</ul>
	</small>

	<div class="settings-row horizontal-lbl">
		<label for="allowGoogle">Allow Google</label>
		<div class="flex-spacer"></div>
		<Toggle id="allowGoogle" bind:value="{$options.allowGoogle}" on:change="{onChange}"/>
	</div>
	<div class="settings-row horizontal-lbl">
		<label for="allowGH">Allow Github</label>
		<div class="flex-spacer"></div>
		<Toggle id="allowGH" bind:value="{$options.allowGH}" on:change="{onChange}"/>
	</div>

</SettingsBlock>


<script>
import SettingsBlock from './settings-block';
import Toggle from '../svelte-toggle';
import {showToast, hideToast} from '../svelte-toaster';
import {options} from '../lib';
const TIMEOUT = 3000;

function onChange () {
	const timer = setTimeout(() => location.reload(), TIMEOUT);
	showToast('Reloading page...', 'info', TIMEOUT, 'Stop', (e, id) => {
		if (e.target.closest('button')) {
			clearTimeout(timer);
			hideToast(id);
		}
	});
}


</script>
