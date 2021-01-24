# Perfect Home - Help and FAQ

Please first read through the common problems/issues:


### [MacOS] Links (tiles on the main screen, items in docked folders) are not focusable using keyboard

1. In System Preferences → Keyboard, in the Shortcuts pane, check the “all controls” radio at the bottom.
2. In Firefox, type `about:config` in the URL bar,
3. Create new **integer** entry called: `accessibility.tabfocus`, and set the value to `7`.
4. Reopen/refresh the Perfect Home page.

---

### Can't open a bookmark to a local file (starting with `file://`)
Firefox prevents bookmarks/links to local files for security reasons.
You can see the error if you open firefox dev tools (on windows: <kbd>F12</kbd> and on mac: <kbd>CMD+ALT+i</kbd>) and click such a link. You shoud see an error that looks like this:
```
Security Error: Content at moz-extension://8b9a7299-b965-814f-a87b-8cdeac5e9d3f/index.html may not load or link to file:///path/to/my/local/file.html.
```
You can manually enable your browser to handle such links:
To do that, open `about:config` page and add these 3 properties:
1. `capability.policy.policynames`, and set it to a string value: `localfilelinks`
2. `capability.policy.localfilelinks.checkloaduri.enabled`, and set it to a string value: `allAccess`
3. `capability.policy.localfilelinks.sites`, and set to `moz-extension://<EXTENSION ID>/index.html`

	The long ID number is the ID of this extension, which is different on every computer.

    You can find yours if you open the Perfect Home in a new tab, then open `Dev Tools` and `Console` tab, and enter: `location.href` and hit <kbd>Enter</kbd>.

After this is done, refresh the Perfect Home tab and your local links should work.

---

### Can't open a bookmark to a Reader View of an article
e.g. `about:reader?url=https%3A%2F%2Fwww.domain.com`
Unfortunately, Firefox prevents opening links like that (security reasons).
As a workaround - *Perfect Home* will strip the reader part of the URI and just open a normal link.

---

### Bookmarks reordering problems

Sometimes it may happen that when using drag&drop to reorder bookmarks - after a reload - they get messed up.
This is due to firefox bookmark reordering issues, i.e.:
- every bookmark has an `index` property, which is used when ordering them on all lists
- if 2 or more bookmarks have the same index - their order will not be consistant

This may be caused by different issues:
- bad or corrupt export/import of bookmarks
- using 3rd party bookmark managers
- browser freeze/crash during the reordering operation

If you are seeing this issue, there's an easy (albeit laborious) fix - in bookmarks manager (or on **Perfect Home** page) where you have a list of bookmarks:
- starting from the last bookmark on the list: grab it and drag it to the first position
- repeat with every other bookmark in this folder (without refreshing the page) until you get to the first bookmark
- this will correctly set the index of every bookmark you reorder - eventually fixing all indexes in this folder
- from now on - everything should work as expected.

---


### Dark theme style looks weird - some parts are still using light theme.

Some parts of the UI depend on the `prefers-color-scheme` css media query. However, there's one firefox setting, which hardens the privacy by restricting the browser access to some OS preferences (including this one). If **about:config** you search for:
```
privacy.resistFingerprinting
```
With that set to  **true** there's no way for the browser to detect if the user has enabled the dark mode, and then it defaults to light. Solutions:
- change this setting to **false** - however, this will reduce your very restrictive privacy policy.
- manually override the css variables (using *Custom CSS* box in *Settings*), like so:
```css
:root {
	--color-border: #000;
	--color-background: #333;
	--color-background-alt: #444;
	--color-text: #fff;
	--color-text-dimmed: #ccc;
	--color-warning: #af8a1a;
}
```



---

# Issues
If you have a different problem please have a look at the [list of issues](https://github.com/perfect-things/perfect-home/issues).

If you can't find one that is relevant, please consider [opening a new one](https://github.com/perfect-things/perfect-home/issues/new).
