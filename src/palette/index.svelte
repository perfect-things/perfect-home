<div class="autocomplete {opened ? '' : 'hidden'}">
	<input type="text" class="autocomplete-input"
		bind:this="{input}"
		bind:value="{text}"
		on:input="{oninput}"
		on:focus="{open}"
		on:keydown="{onkeydown}"
		on:keypress="{onkeypress}"
		>
	<div class="autocomplete-list" bind:this="{list}">
		{#each filteredData as item, i}
			<div
				class="autocomplete-list-item autocomplete-list-item-{item.type} {i === highlightIndex ? 'selected' : ''}"
				on:click="{() => onclick(item)}">
				<div class="autocomplete-list-item-icon"></div>
				<span class="autocomplete-list-item-text">
					{@html item.highlightedTitle || item.title}
				</span>
			</div>
		{/each}
	</div>
</div>

<svelte:window on:click={onDocumentClick}/>

<script>
import {onMount} from 'svelte';
import {currentFolder} from '../store';
import {fuzzy, emphasize} from '../lib';


export let data = [];
export let value = null;
export let text = '';
let opened = false;
let highlightIndex = 0;
let input, list, filteredData;

onMount(() => {
	close();
	clear();
	document.addEventListener('keydown', onDocumentKeydown);
});

function gotoItem (item) {
	if (item.type === 'folder') currentFolder.set(item.id);
	else if (item.type === 'bookmark') location.href = item.url;
}


function onDocumentKeydown (e) {
	const key = e.key;
	if (key === 'p' && e.metaKey) {
		e.preventDefault();
		toggle();
	}
}


$: {
	const q = text.toLowerCase();
	let filtered = data.filter(item => item.type !== 'separator');
	if (text) filtered = filtered
		.filter(item => fuzzy(item.title, q))
		.map(item => (item.highlightedTitle = emphasize(item.title, q), item));
	filteredData = filtered;
}


function selectItem () {
	value = filteredData[highlightIndex];
	text = value.title;
	close();
	gotoItem(value);
}

function up () {
	if (highlightIndex > 0) highlightIndex--;
	highlight();
}

function down () {
	if (highlightIndex < filteredData.length - 1) highlightIndex++;
	highlight();
}

function highlight () {
	const el = list.querySelector('.selected');
	if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


function onclick (item) {
	value = item;
	text = item.title;
	close();
	gotoItem(item);
}

function onDocumentClick (e) {
	if (!e.target.closest('.autocomplete')) close();
}

function onkeydown (e) {
	let key = e.key;
	if (key === 'Tab' && e.shiftKey) key = 'ShiftTab';
	const fnmap = {
		Tab: opened ? down.bind(this) : null,
		ShiftTab: opened ? up.bind(this) : null,
		ArrowDown: down.bind(this),
		ArrowUp: up.bind(this),
		Escape: onEsc.bind(this),
	};
	const fn = fnmap[key];
	if (typeof fn === 'function') {
		e.preventDefault();
		fn(e);
	}
}

function oninput (e) {
	text = e.target.value;
	open();
	highlightIndex = 0;
}

function onkeypress (e) {
	if (e.key === 'Enter') {
		e.preventDefault();
		selectItem();
	}
}

function onEsc (e) {
	if (text) return clear();
	e.stopPropagation();
	if (opened) {
		input.focus();
		close();
	}
}

function clear () {
	text = '';
	setTimeout(() => input.focus());
}

function open () {
	opened = true;
	setTimeout(() => input.select(), 100);
}

function close () {
	opened = false;
}

function toggle () {
	return opened ? close() : open();
}

</script>
