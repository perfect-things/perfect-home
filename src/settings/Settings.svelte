<svelte:head>
	<title>{$options.pageTitle}</title>
</svelte:head>
<button
	title="Settings"
	class="icon-btn btn-settings"
	class:hidden="{!isVisible}"
	bind:this="{settingsBtn}"
	on:keydown="{e => trapfocus(e, 'first')}"
	on:click="{toggle}">
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -256 1792 1792" aria-label="Cog"><g transform="matrix(1,0,0,-1,121.49153,1285.4237)"><path aria-label="Cog" d="m 1024,640 q 0,106 -75,181 -75,75 -181,75 -106,0 -181,-75 -75,-75 -75,-181 0,-106 75,-181 75,-75 181,-75 106,0 181,75 75,75 75,181 z m 512,109 V 527 q 0,-12 -8,-23 -8,-11 -20,-13 l -185,-28 q -19,-54 -39,-91 35,-50 107,-138 10,-12 10,-25 0,-13 -9,-23 -27,-37 -99,-108 -72,-71 -94,-71 -12,0 -26,9 l -138,108 q -44,-23 -91,-38 -16,-136 -29,-186 -7,-28 -36,-28 H 657 q -14,0 -24.5,8.5 Q 622,-111 621,-98 L 593,86 q -49,16 -90,37 L 362,16 Q 352,7 337,7 323,7 312,18 186,132 147,186 q -7,10 -7,23 0,12 8,23 15,21 51,66.5 36,45.5 54,70.5 -27,50 -41,99 L 29,495 Q 16,497 8,507.5 0,518 0,531 v 222 q 0,12 8,23 8,11 19,13 l 186,28 q 14,46 39,92 -40,57 -107,138 -10,12 -10,24 0,10 9,23 26,36 98.5,107.5 72.5,71.5 94.5,71.5 13,0 26,-10 l 138,-107 q 44,23 91,38 16,136 29,186 7,28 36,28 h 222 q 14,0 24.5,-8.5 Q 914,1391 915,1378 l 28,-184 q 49,-16 90,-37 l 142,107 q 9,9 24,9 13,0 25,-10 129,-119 165,-170 7,-8 7,-22 0,-12 -8,-23 -15,-21 -51,-66.5 -36,-45.5 -54,-70.5 26,-50 41,-98 l 183,-28 q 13,-2 21,-12.5 8,-10.5 8,-23.5 z" style="fill:currentColor"/></g></svg>
</button>

{#if isVisible}
	<div class="settings-pane"
		transition:fly="{{ x: 310, duration: $options.animSpeed }}"
		tabindex="-1">

		<h1>Settings</h1>
		<div class="settings-form">
			<MainFolder {folders} />
			<DockedFolders {folders} />
			<Customize />
			<Privacy />
			<ImportExport />
			<Reset />
		</div>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex a11y-no-static-element-interactions -->
		<div tabindex="0" on:keydown="{e => trapfocus(e, 'last')}" bind:this="{lastFocusEl}"></div>
	</div>
{/if}

<script>
import { onMount } from 'svelte';
import { fly } from 'svelte/transition';
import { EVENT, getAllItems, getSettings, saveSettings, options, defaultOptions } from '../lib';

import MainFolder from './block-main-folder';
import DockedFolders from './block-docked-folders';
import Customize from './block-customize';
import Privacy from './block-privacy';
import ImportExport from './block-import-export';
import Reset from './block-reset';

let folders = [];
let isVisible = false, settingsBtn, lastFocusEl;


onMount(() => {
	getAllItems()
		.then(parseFoldersAndSort)
		.then(loadSettings);
	EVENT.on(EVENT.document.clicked, onDocClick);
});

function parseFoldersAndSort (items) {
	folders = items
		.filter(item => item.type === 'folder')
		.sort((a, b) => a.title.localeCompare(b.title));
}

function loadSettings () {
	getSettings().then(stored => {
		options.set(Object.assign({}, $defaultOptions, stored));
		options.subscribe(saveSettings);
		EVENT.fire(EVENT.settings.loaded);
	});
}


function toggle (e) {
	const focusBtn = (!e.screenX && !e.screenY);
	isVisible ? close(focusBtn) : open();
}

function open () {
	isVisible = true;
}

function close (focusBtn) {
	isVisible = false;
	if (focusBtn) settingsBtn.focus();
}


function onDocClick (e) {
	if (e.target.closest('.settings-pane,.btn-settings')) return;
	if (!isVisible) return;
	close();
}

function trapfocus (e, how) {
	if (!isVisible || e.key !== 'Tab') return;
	if (how === 'first' && e.shiftKey) {
		e.preventDefault();
		lastFocusEl.focus();
	}
	else if (how === 'last' && !e.shiftKey) {
		e.preventDefault();
		settingsBtn.focus();
	}
}

</script>
