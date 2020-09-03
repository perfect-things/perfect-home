<Modal title="Error" bind:this="{modal}">
	<p>
		Unfortunately, due to Firefox security restrictions,<br>
		Perfect Home is unable to open links to local files.<br><br>
		You can change that yourself in your browser settings.<br>
		See <a href="https://github.com/perfect-things/perfect-home/blob/master/FAQ.md#cant-open-a-bookmark-to-a-local-file-starting-with-file" target="_blank">FAQ</a> on how to do that.<br>
		Your extension URL is:<br>
		<input class="ext-url" type="text" readonly value="{location.href}" on:focus="{e => e.target.select()}">
	</p>
	<div class="buttons">
		<button type="button" class="btn" on:click="{modal.close()}">Close</button>
		<div class="flex-spacer"></div>
	</div>
</Modal>

<script>
import Modal from '../svelte-modal';
import {EVENT} from '../lib';

let modal;

EVENT.on(EVENT.document.localLink, () => modal.open());

</script>
