<SettingsBlock collapsed title="Customize">
	<h3 id="lbl-theme">Theme</h3>
	<small>See <a href="https://github.com/perfect-things/perfect-home-themes#perfect-home---themes" target="_blank">
		more info on Theming</a>.
	</small>
	{#if $options.allowGH}
		<div class="select-wrap">
			<!-- svelte-ignore a11y-no-onchange -->
			<select name="theme" aria-labelledby="lbl-theme"
				bind:value="{$options.theme}" on:change="{onThemeChange}">
				<option value="">None</option>
				{#each $themeNames as themeName}
					<option value="{themeName}">{themeName}</option>
				{/each}
			</select>
		</div>
	{:else}
	<p class="danger">To use themes you need to <em>Allow Github</em> in <em>Privacy</em> section below.</p>
	{/if}


	<h3>Basic customizations</h3>

	<div class="settings-row">
		<label for="pageTitle">Page title</label>
		<input id="pageTitle" type="text" bind:value="{$options.pageTitle}" placeholder="New Tab">
	</div>

	<div class="settings-row">
		<label for="gridMaxWidth">Max grid width</label>
		<input class="inp-short" id="gridMaxWidth" type="number" bind:value="{$options.gridMaxWidth}">
	</div>

	<div class="settings-row">
		<label for="gridGap">Gaps</label>
		<input class="inp-short" id="gridGap" type="number" bind:value="{$options.gridGap}">
	</div>

	<div class="settings-row">
		<label id="lbl-tile-size" for="tile-size">Tile size</label>
		<div class="flex-spacer"></div>
		<input class="inp-short" aria-labelledby="lbl-tile-size" aria-label="Tile width" type="number" bind:value="{$options.iconWidth}">
		<input class="inp-short" aria-labelledby="lbl-tile-size" aria-label="Tile height" type="number" bind:value="{$options.iconHeight}">
	</div>

	<div class="settings-row">
		<label for="pageColor">Text color</label>
		<div class="flex-spacer"></div>
		<input class="inp-short" aria-label="Select text color" type="color" bind:value="{$options.pageColor}">
		<input class="inp-short" aria-label="Enter text color hex" id="pageColor" type="text" bind:value="{$options.pageColor}">
	</div>

	<div class="settings-row">
		<label for="pageBg">Background</label>
		<div class="flex-spacer"></div>
		<input class="inp-short" aria-label="Select background color" type="color" bind:value="{$options.pageBg}">
		<input class="inp-short" aria-label="Enter background color hex" id="pageBg" type="text" bind:value="{$options.pageBg}">
	</div>

	<div class="settings-row horizontal-lbl">
		<label for="showLabels">Show labels</label>
		<div class="flex-spacer"></div>
		<Toggle id="showLabels" bind:value="{$options.showLabels}"/>
	</div>

	<div class="settings-row horizontal-lbl">
		<label for="animSpeed">Animation speed in ms</label>
		<div class="flex-spacer"></div>
		<input class="inp-short" id="animSpeed" type="number" bind:value="{$options.animSpeed}" min="0">
	</div>


	<h3>Custom CSS</h3>
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


<script>
import {onMount} from 'svelte';
import SettingsBlock from './settings-block';
import Toggle from '../svelte-toggle';
import {themes, themeNames, options, validateCustomCss} from '../lib';


onMount(() => {
	load();
});

function load () {
	if (Object.keys($themes).length) return;
	themes.load();
}

function validateCss (ev) {
	const el = ev.target;
	const text = el.value || '';
	const res = validateCustomCss(text);
	el.setCustomValidity(res ? '' : 'Check your CSS!');
}


function onThemeChange () {
	themes.apply();
}

</script>
