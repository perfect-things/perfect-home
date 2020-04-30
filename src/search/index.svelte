<Modal bind:this="{modal}" cssClass="search-modal">
	<div class="autocomplete">
		<input type="text" class="autocomplete-input"
			bind:this="{input}"
			on:input="{filter}"
			on:focus="{open}"
			on:keydown="{onkeydown}"
			on:keypress="{onkeypress}"
			>
		<div class="autocomplete-list" bind:this="{list}">
			{#each filteredData as item, i (item.id)}
			<div
				class="autocomplete-list-item autocomplete-list-item-{item.type}"
				class:selected="{i === highlightIndex}"
				on:click="{() => onclick(item)}">

				<div class="autocomplete-list-item-icon"
					style="{item.favicon ? `background-image: url(${item.favicon})` : ''}">
				</div>
				<span class="autocomplete-list-item-text">
					{@html item.highlightedTitle || item.title}
				</span>
			</div>
			{/each}
		</div>
	</div>
</Modal>


<script>
import {onMount} from 'svelte';
import {currentFolder} from '../store';
import Modal from '../svelte-modal';
import {EVENT, clone, fuzzy, emphasize, getAllItems, getFavicon} from '../lib';

let modal;
let data = [];
let text = '';
let highlightIndex = 0;
let input, list, filteredData = [];



onMount(() => {
	close();
	clear();
	document.addEventListener('keydown', onDocumentKeydown);
	EVENT.on(EVENT.search.toggle, toggle);
});


function load () {
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
	const hlelem = list.querySelector('.selected');
	if (hlelem) hlelem.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


function onclick (item) {
	text = item.title;
	close();
	gotoItem(item);
}


function onkeydown (e) {
	let key = e.key;
	if (key === 'Tab' && e.shiftKey) key = 'ShiftTab';
	const fnmap = {
		Tab: modal.opened ? down.bind(this) : null,
		ShiftTab: modal.opened ? up.bind(this) : null,
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
	if (text) {
		filtered = filtered
			.filter(item => fuzzy(item.title, q))
			.map(item => {
				item.highlightedTitle = emphasize(item.title, q);
				item.score = 1;
				if (item.title.toLowerCase().includes(q)) item.score = 2;
				if (item.title.includes(text)) item.score = 3;
				if (item.title.toLowerCase() === q) item.score = 4;
				if (item.title === text) item.score = 5;
				return item;
			});
		filtered = filtered.sort((a, b) => b.score - a.score);
	}
	filteredData = filtered;
}


function onkeypress (e) {
	if (e.key === 'Enter') {
		e.preventDefault();
		selectItem();
	}
}

function onEsc (e) {
	e.stopPropagation();
	if (text) return clear();
	if (modal.opened) {
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
	modal.open();
	if (!data.length) load();
	setTimeout(() => input.select(), 100);
}

function close () {
	modal.close();
	setTimeout(clear, 150);
}

function toggle () {
	modal.opened ? close() : open();
}

</script>
