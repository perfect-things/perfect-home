# Perfect Home
Replace your new-tab page and home page with your bookmarks.
No ads, no speed dials, no frequently visited or other "frecence" bullshit!
Just your own, predictable grid of links.

![Screen1](_stuff/screen1.png)


## FEATURES
- [x] drag & drop to reorder
- [x] command palette (filter flat list)
- [ ] improve styling (bigger tiles)
- [ ] custom images for tiles
- [ ] light/dark themes
- [ ] custom css
- [ ] accessibility
- [ ] shortcuts (1-9?)
- [x] Requires only 1 permission (bookmarks)!


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
