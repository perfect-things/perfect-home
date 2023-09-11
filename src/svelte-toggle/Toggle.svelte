<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="toggle" class:checked="{value}" disabled="{disabled}" bind:this="{el}"
	tabIndex="{disabled ? undefined : 0}"
	on:keydown="{onKey}"
	on:touchstart={dragStart}
	on:mousedown={dragStart}
	on:contextmenu|preventDefault
	on:click|preventDefault>
	<label class="toggle-label" bind:this="{label}">
		<div class="toggle-handle" bind:this="{handle}"></div>
		<input {id} type="checkbox" class="toggle-input" bind:checked="{value}">
	</label>
</div>
<script>
import { onMount , createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();

const isTouchDevice = 'ontouchstart' in document.documentElement;
const getMouseX = e => (e.type.includes('touch')) ? e.touches[0].clientX : e.clientX;
const getElemWidth = el => {
	const css = getComputedStyle(el);
	const borders = parseFloat(css.borderLeftWidth) + parseFloat(css.borderRightWidth);
	return el.getBoundingClientRect().width - borders;
};

export let id = undefined;
export let value = false;
export let disabled = undefined;
let el, label, handle, startX, maxX, minX, currentX = 0;
let isClick = false, isDragging = false;

onMount(() => {
	maxX = getElemWidth(el);
	minX = getElemWidth(handle);
	setValue(undefined, true);
});

function setValue (v, skipEvent = false) {
	if (typeof v !== 'undefined') value = v;
	startX = currentX = value ? maxX : minX;
	label.style.width = `${currentX}px`;
	if (!skipEvent) dispatch('change', value);
}

function onKey (e) {
	if (e.key === 'Enter' || e.key === ' ') {
		e.preventDefault();
		setValue(!value);
	}
}

function dragStart (e) {
	// prevent double call on mobile
	if (isTouchDevice && e.type !== 'touchstart') return;

	if (e.type === 'touchstart') {
		document.addEventListener('touchend', dragEnd);
		document.addEventListener('touchmove', drag, { passive: false });
	}
	else {
		document.addEventListener('mouseup', dragEnd);
		document.addEventListener('mousemove', drag, { passive: false });
	}
	label.style.transition = 'none';
	startX = getMouseX(e) - currentX;
	isDragging = true;
	isClick = true;
}

function dragEnd () {
	document.removeEventListener('mouseup', dragEnd);
	document.removeEventListener('mousemove', drag);
	document.removeEventListener('touchend', dragEnd);
	document.removeEventListener('touchmove', drag);
	label.style.transition = '';
	isDragging = false;
	if (isClick) setValue(!value);
	else setValue(currentX - minX >= (maxX - minX) / 2);
}

function drag (e) {
	if (!isDragging) return;
	isClick = false;
	e.preventDefault();
	currentX = getMouseX(e) - startX;
	if (currentX > maxX) currentX = maxX;
	if (currentX < minX) currentX = minX;
	label.style.width = `${currentX}px`;
}
</script>
