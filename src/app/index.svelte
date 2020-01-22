<Header />
<Main />
<Folders />
<Settings />
<ContextMenu />
<Palette />
<Editor />
<Toaster />
<Cron />

<script>
import Header from '../header';
import Main from '../main';
import Folders from '../folders';
import ContextMenu from '../context-menu';
import Settings from '../settings';
import Palette from '../palette';
import Editor from '../editor';
import Toaster from '../toaster';
import Cron from '../cron';
import {EVENT} from '../lib';

document.addEventListener('click', e => EVENT.fire(EVENT.document.clicked, e));

</script>
