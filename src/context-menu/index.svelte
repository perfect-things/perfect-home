<ul class="context-menu {opened ? '' : 'hidden'}" bind:this="{menuEl}">
	<li class="context-menu-item" on:click="{() => menuItemClick('thumb')}">Custom thumbnail</li>
	<li class="context-menu-item context-menu-separator"></li>
	<li class="context-menu-item" on:click="{() => menuItemClick('del')}">Delete bookmark</li>
</ul>

<svelte:window on:click={onDocumentClick} on:contextmenu="{onContextMenu}"/>

<script>
import {animate, getBookmark, delBookmark} from '../lib';

let menuEl;
let item, el;
let opened = false;


function deleteBookmark () {
	const from = {transform: 'scale(1)', opacity: 1};
	const to = {transform: 'scale(0)', opacity: 0};
	animate(el, from, to).then(() => el.remove());
	delBookmark(item.id);
}

function menuItemClick (action) {
	const actions = {
		del: deleteBookmark,
		// thumb: customThumbnail
	};
	if (actions[action]) actions[action]();
	close();
}



function updatePosition (e)  {
	menuEl.style.left = e.pageX + 'px';
	menuEl.style.top = e.pageY + 'px';
}

function onContextMenu (e) {
	el = e.target.closest('.item');
	if (!el) return;
	e.preventDefault();
	getBookmark(el.dataset.id).then(i => item = i);
	updatePosition(e);
	open();
}

function onDocumentClick (e) {
	if (!e.target.closest('.context-menu')) close();
}


function open () {
	opened = true;
}

function close () {
	opened = false;
}

</script>
