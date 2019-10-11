# Perfect Home - Help and FAQ

## FAQ
Please first read through the common problems/issues:


<details><summary>**[MacOS] Links (tiles on the main screen, items in docked folders) are not focusable using keyboard**</summary>

1. In System Preferences → Keyboard, in the Shortcuts pane, check the “all controls” radio at the bottom.
2. In Firefox, type `about:config` in the URL bar,
3. Create new **integer** entry called: `accessibility.tabfocus`, and set the value to `7`.
4. Reopen/refresh the Perfect Home page.

</details>


<details><summary>**Bookmarks reordering problems**</summary>
<p>
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
</p>
</details>



## Issues
If you have a different problem please have a look at the [list of issues](https://github.com/tborychowski/perfect-home/issues).

If you can't find one that is relevant, please consider [opening a new one](https://github.com/tborychowski/perfect-home/issues/new).
