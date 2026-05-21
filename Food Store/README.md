# Food Store Selenium Tests

This project uses Selenium WebDriver to run a simple browser smoke test against `index.html`.

## Setup

1. Open a terminal in the `Food Store` folder.
2. Install Node.js if needed:
   - macOS: install from https://nodejs.org or use Homebrew: `brew install node`
3. Run `npm install`.
4. Enable Safari automation:
   - `npm run enable-safari`
   - then open Safari and enable "Allow Remote Automation" in the Develop menu.

## Run tests

- Run `npm test` for the WebDriver smoke test.

## Selenium IDE

The project includes a Selenium IDE test suite in `selenium-ide/project.side`.

1. Open a terminal in the `Food Store` folder.
2. Start a local web server:
   - `python3 -m http.server 8000`
3. Open Selenium IDE and load `selenium-ide/project.side`.
4. Run the tests from Selenium IDE.

These IDE tests cover:

- opening `index.html`
- verifying the title and logo text
- searching for `Pizza`
- adding an item to the cart
- verifying the cart panel and total
- filtering menu categories

The WebDriver script and Selenium IDE project are separate; use the IDE project when you need Selenium IDE tests.

## Notes

- On macOS, enable Safari remote automation: open Safari, enable the Develop menu, then turn on "Allow Remote Automation".
- If the UI changes, update `test/selenium.test.js` selectors accordingly.
