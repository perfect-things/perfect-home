<div class="settings-block"
	class:collapsible
	class:collapsed
	bind:this="{blockElement}">

	<h2 class="settings-block-header" on:click={onclick}>
		{title}
		<div class="chevron" class:hidden="{!collapsible}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></div>
	</h2>
	<div class="settings-block-content">
		<slot></slot>
	</div>
</div>


<script>
export let title = '';
export let collapsed = false;
export let collapsible;
let blockElement;


function onclick () {
	if (!collapsible) return;
	collapsed = !collapsed;
}
</script>
