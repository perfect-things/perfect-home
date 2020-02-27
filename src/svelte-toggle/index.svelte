<div>
	<input {id} type="range" min="0" max="100" value="0" class="toggle"
		bind:this="{el}"
		on:change="{onchange}"
		on:keydown="{onkeydown}"
		on:keypress="{onkeypress}"
	>
</div>

<script>
import {afterUpdate} from 'svelte';
export let id;
export let value = false;
let el;

afterUpdate(() => {
	el.value = +value * 100;
});

function onchange () {
	el.value = Math.round(el.value / 100) * 100;
	value = !!+el.value;
}

function onkeydown (e) {
	if (e.key === 'ArrowRight') el.value = 100;
	else if (e.key === 'ArrowLeft') el.value = 0;
	value = !!+el.value;
}

function onkeypress (e) {
	if (e.key === ' ' || e.key === 'Enter') el.value = +el.value ? 0 : 100;
	value = !!+el.value;
}

</script>
