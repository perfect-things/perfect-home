# Perfect Home
Replace your new-tab page and home page with your bookmarks.
No ads, no speed dials, no frequently visited or other "frecence" bullshit!
Just your own, predictable grid of links.

**Download from [mozilla addons page](https://addons.mozilla.org/en-US/firefox/addon/perfect-home/)**

**[![Screenshot](_stuff/screen-main.png)](https://addons.mozilla.org/en-US/firefox/addon/perfect-home/)**

## FEATURES
- [x] Drag & drop tiles to reorder
- [x] Command palette (filter flat list) (currently Cmd+P on mac - when focus is on page)
- [x] Custom images for tiles (right-click on a tile -> edit, or just drag an image from desktop and drop it on a thumbnail)
- [x] Style page with custom css - paste your css in settings
- [x] Requires only 1 permissions (bookmarks)!
- [x] Theme support! :tada:
- [x] Settings export/import
- [x] Docked Folders


## Usage
- Select a folder from your bookmarks
- Enjoy!


## Privacy
This extension only needs 1 permission from Firefox - to access your bookmarks.
You can also allow this extension to send requests to 3rd party services:
- Google Favicon service - to display nice favicons in Docked Folders and in the Search panel
- Github API - to be able to use the Themes

If you do NOT allow either of these - the extension will still work without any issues. You just won't see the favicons or won't be able to use themes directly from the extension (you can still manually download theme icons & copy & paste the css).

You can change these options in the extension settings, in the **Privacy** section


## Themes
More on how to use Themes in the [PerfectHome Themes](https://github.com/perfect-things/perfect-home-themes#perfect-home---themes) repository.


## Customization
See [a tutorial here](customization-tutorial.md)



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

## Creating test-profile in Firefox
1. Open `about:profiles`
2. Create `test-profile`
3. Set your previous profile as "default" again


## Buy me a coffee :smile:
<a href="https://www.buymeacoffee.com/dziadborowy" target="_blank"><img height="60" width="217" src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

