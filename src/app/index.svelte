<Header />
<Main />
<Folders />
<Settings />
<ContextMenu />
<Search />
<Editor />
<Toaster />
<LocalLinkWarning/>
<Cron />

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
import LocalLinkWarning from './localLinkWarning';
import {EVENT} from '../lib';

document.addEventListener('click', e => EVENT.fire(EVENT.document.clicked, e));

// don't open a file when dropped on the page
window.addEventListener('dragover', e => e.preventDefault(),false);
window.addEventListener('drop', e => e.preventDefault(), true);

</script>
