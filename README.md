# Perfect Home
Replace your new-tab page and home page with your bookmarks.
No ads, no speed dials, no frequently visited or other "frecence" bullshit!
Just your own, predictable grid of links.

## First pre-release available for testing!
- Download from [mozilla addons page](https://addons.mozilla.org/en-US/firefox/addon/perfect-home/)
- Enjoy :smile:

![Screen1](_stuff/screen-main.png)


## FEATURES
- [x] Drag & drop tiles to reorder
- [x] Command palette (filter flat list) (currently Cmd+P on mac - when focus is on page)
- [x] Use custom images for tiles (right-click on a tile -> custom thumbnail)
- [x] Style page with custom css - paste your css in settings
- [x] Requires only 2 permissions: bookmarks & storage (to save settings & cache thumbnails)!
- [x] Settings export/import


## TODO
- [ ] light/dark themes (css based on the OS?)
- [ ] accessibility (keyboard support)


## Usage
- Select a folder from your bookmarks
- Enjoy!


## Build locally
1. `npm i`
2. To test the extension in a temporary firefox profile, use the test script:
    ```sh
    npm start
    ```
3. To build a zip artifact (that can be uploaded to mozilla addons):
    ```sh
    npm run ext-build
    ```
