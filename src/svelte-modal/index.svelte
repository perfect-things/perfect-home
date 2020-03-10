<div class="modal-backdrop"
	class:visible="{opened}"
	bind:this="{backdropEl}"
	on:click="{onBackdropClick}">

	<div class="modal">
		<h1>{title}</h1>
		<div class="modal-content" bind:this="{contentEl}">
			<div tabindex="0" class="focus-trap focus-trap-top" on:focus="{focusLast}"></div>
			<slot></slot>
			<div tabindex="0" class="focus-trap focus-trap-bottom" on:focus="{focusFirst}"></div>
		</div>
	</div>
</div>
<script>
export let title = '';
let backdropEl, contentEl, triggerEl, opened = false;

function focusFirst () {
	const focusable = getFocusableElements().shift();
	if (focusable) focusable.focus();
}

function focusLast () {
	const focusable = getFocusableElements().pop();
	if (focusable) focusable.focus();
}

function getFocusableElements () {
	return Array.from(contentEl.querySelectorAll('a[href],button:not([disabled]),iframe:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[contentEditable]'));
}

function onBackdropClick (e) {
	if (!e.target.closest('.modal')) close();
}

function onDocKeydown (e) {
	if (e.key === 'Escape' && opened) close();
}

export function open () {
	if (opened) return;
	triggerEl = document.activeElement;
	backdropEl.style.display = 'flex';
	setTimeout(() => {
		opened = true;
		focusFirst();
		document.addEventListener('keydown', onDocKeydown);
	}, 100);
}

export function close () {
	if (!opened) return;
	setTimeout(() => opened = false);
	setTimeout(() => {
		backdropEl.style.display = 'none';
		if (triggerEl) triggerEl.focus();
		document.removeEventListener('keydown', onDocKeydown);
	}, 150);

}

</script>
