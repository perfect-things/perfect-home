# New Tab from Bookmarks folder
New tab extension for Firefox which displays bookmarks from a `speeddial` folder.

![Screen1](_stuff/screen1.png)

# Usage
Create a `speeddial` folder in your bookmarks and put some bookmarks there.
Open new tab.

# Steps to build locally
1. `yarn`
2. To test the extension in a temporary firefox profile, use the test script:
    ```sh
    yarn start
    ```
	

3. To build a zip artifact (that can be uploaded to mozilla addons):
    ```sh
    yarn build
    ```
