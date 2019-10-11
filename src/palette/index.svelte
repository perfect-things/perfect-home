<div class="autocomplete {opened ? '' : 'hidden'}">
	<input type="text" class="autocomplete-input"
		bind:this="{input}"
		on:input="{filter}"
		on:focus="{open}"
		on:keydown="{onkeydown}"
		on:keypress="{onkeypress}"
		>
	<div class="autocomplete-list" bind:this="{list}">
		{#each filteredData as item, i}
			<div
				class="autocomplete-list-item autocomplete-list-item-{item.type} {i === highlightIndex ? 'selected' : ''}"
				on:click="{() => onclick(item)}">
				<div class="autocomplete-list-item-icon"
					style="{item.favicon ? `background-image: url(${item.favicon})` : ''}"></div>
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
import {clone, fuzzy, emphasize, getAllItems, getFavicon} from '../lib';


let data = [];
let text = '';
let opened = false;
let highlightIndex = 0;
let input, list, filteredData = [];



onMount(() => {
	close();
	clear();
	document.addEventListener('keydown', onDocumentKeydown);
});


function load () {
	console.log('loading');
	getAllItems()
		.then(all => {
			data = all
				.filter(item => item.type !== 'separator')
				.map(item => {
					if (item.type === 'bookmark') item.favicon = getFavicon(item.url);
					return item;
				});
		})
		.then(filter);
}


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


function selectItem () {
	const item = filteredData[highlightIndex];
	text = item.title;
	close();
	gotoItem(item);
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

function filter () {
	text = input.value || '';
	highlightIndex = 0;

	const q = text.toLowerCase();
	let filtered = clone(data).filter(item => item.type !== 'separator');
	if (text) filtered = filtered
		.filter(item => fuzzy(item.title, q))
		.map(item => (item.highlightedTitle = emphasize(item.title, q), item));

	filteredData = filtered;
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
	input.value = '';
	filter();
	setTimeout(() => input.focus());
}

function open () {
	if (opened) return;
	if (!data.length) load();
	opened = true;
	setTimeout(() => input.select(), 100);
}

function close () {
	if (!opened) return;
	opened = false;
	setTimeout(clear, 300);
}

function toggle () {
	opened ? close() : open();
}

</script>
