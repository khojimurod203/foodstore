# Selenium IDE for Food Store

This folder contains a Selenium IDE project for the `Food Store` app.

## Setup

1. Install Selenium IDE in Firefox:
   - Firefox: https://addons.mozilla.org/firefox/addon/selenium-ide/

2. Run a local server from the `Food Store` folder.
   In a terminal:

   ```bash
   cd '/Users/khojimurod/Desktop/test/Food Store'
   python3 -m http.server 8000
   ```

3. Open Firefox and click the Selenium IDE extension icon.

4. In Selenium IDE:
   - choose `Open existing project` or `File > Open`.
   - load `Food Store/selenium-ide/project.side`.

5. Select the test suite `Default Suite` then click `Run`.

## What this project covers

- opens `index.html` via `http://localhost:8000/index.html`
- verifies the page title is `Food Store`
- verifies the heading text `Welcome to Food Store`
- searches for `Pizza`
- adds the first item to the cart
- opens the cart and checks the cart total
- filters the menu by category

## Notes

- Selenium IDE runs in the browser, not from the terminal. Open the Firefox extension to run the tests.
- If you want a terminal-only test, use `npm test` in the `Food Store` folder. That runs the Node.js WebDriver script in `test/selenium.test.js`.
- Keep the local server running while the Selenium IDE test executes.
- If the test fails, make sure `http://localhost:8000/index.html` loads correctly in Firefox first.
- The IDE project is separate from the Node.js WebDriver test in `test/selenium.test.js`.
