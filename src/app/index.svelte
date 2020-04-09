<Header />
<Main />
<Folders />
<Settings />
<ContextMenu />
<Search />
<Editor />
<Toaster />
<Cron />

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
		<div class="flex-spacer"></div>
		<button type="button" class="btn" on:click="{modal.close()}">Close</button>
	</div>
</Modal>


<script>
import Header from '../header';
import Main from '../main';
import Folders from '../folders';
import ContextMenu from '../context-menu';
import Settings from '../settings';
import Search from '../search';
import Editor from '../editor';
import Cron from '../cron';
import Toaster from '../svelte-toaster';
import Modal from '../svelte-modal';
import {EVENT} from '../lib';

let modal;

document.addEventListener('click', e => EVENT.fire(EVENT.document.clicked, e));

// don't open a file when dropped on the page
window.addEventListener('dragover', e => e.preventDefault(),false);
window.addEventListener('drop', e => e.preventDefault(), true);

EVENT.on(EVENT.document.localLink, () => modal.open());

</script>
