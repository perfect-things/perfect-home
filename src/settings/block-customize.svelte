<SettingsBlock collapsed title="Customize">
	<h3 id="lbl-theme">Theme</h3>
	<small>See <a href="https://github.com/perfect-things/perfect-home-themes#perfect-home---themes" target="_blank">
		more info on Theming</a>.
	</small>
	<div class="select-wrap">
		<!-- svelte-ignore a11y-no-onchange -->
		<select name="theme" aria-labelledby="lbl-theme"
			bind:value="{$options.theme}" on:change="{onThemeChange}">
			<option value="">None</option>
			{#each themeNames as themeName}
				<option value="{themeName}">{themeName}</option>
			{/each}
		</select>
	</div>


	<h3>Basic customizations</h3>
	<div class="settings-row">
		<label for="gridMaxWidth">Max grid width</label>
		<input id="gridMaxWidth" type="number" bind:value="{$options.gridMaxWidth}">
	</div>

	<div class="settings-row">
		<label for="gridGap">Gaps</label>
		<input id="gridGap" type="number" bind:value="{$options.gridGap}">
	</div>

	<div class="settings-row">
		<label id="lbl-tile-size" for="tile-size">Tile size</label>
		<div class="flex-spacer"></div>
		<input aria-labelledby="lbl-tile-size" aria-label="Tile width" type="number" bind:value="{$options.iconWidth}">
		<input aria-labelledby="lbl-tile-size" aria-label="Tile height" type="number" bind:value="{$options.iconHeight}">
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
import {getThemes, themeIcons, options, validateCustomCss, getThemeCSS} from '../lib';

let themeNames = [];
let themes = {};

onMount(() => {
	getThemes().then(thms => {
		themeNames = Object.keys(thms);
		themes = thms;
		onThemeChange();
	});
});


function validateCss (ev) {
	const el = ev.target;
	const text = el.value || '';
	const res = validateCustomCss(text);
	el.setCustomValidity(res ? '' : 'Check your CSS!');
}


function onThemeChange () {
	if ($options.theme && themes[$options.theme]) {
		themeIcons.set(themes[$options.theme].icons);
		getThemeCSS(themes[$options.theme].css).then(css => {
			$options.themeCSS = ('' + css).replace(/[\n\t]/g, '');
		});
	}
}

</script>
