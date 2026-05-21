const path = require('path');
const { Builder, By, until } = require('selenium-webdriver');

async function getDriverFor(browserName) {
  browserName = (browserName || process.env.BROWSER || 'safari').toLowerCase();
  let driverBuilder = new Builder().forBrowser(browserName);

  if (browserName === 'chrome') {
    const chrome = require('selenium-webdriver/chrome');
    const options = new chrome.Options();
    // Uncomment headless if you want headless runs: options.addArguments('--headless=new');
    driverBuilder.setChromeOptions(options);
  }

  if (browserName === 'firefox') {
    const firefox = require('selenium-webdriver/firefox');
    const options = new firefox.Options();
    // options.headless();
    driverBuilder.setFirefoxOptions(options);
  }

  if (browserName === 'safari') {
    const safari = require('selenium-webdriver/safari');
    driverBuilder.setSafariOptions(new safari.Options());
  }

  return driverBuilder.build();
}

async function runFullTest() {
  const browser = process.env.BROWSER || 'safari';
  let driver;

  try {
    driver = await getDriverFor(browser);
  } catch (err) {
    console.error('Failed to build driver.');
    console.error(err);
    process.exit(1);
  }

  try {
    const fileUrl = `file://${path.resolve(__dirname, '../index.html')}`;
    await driver.get(fileUrl);

    await verifyTitleAndLogo(driver);
    await verifySearchVariants(driver);
    await verifyAddMultipleItemsAndCart(driver);
    await verifyQuantityChangeAndTotal(driver);
    await verifyRemoveItem(driver);
    await verifyCheckoutAlert(driver);

    console.log('✅ Full WebDriver test suite passed.');
  } finally {
    await driver.quit();
  }
}

async function verifyTitleAndLogo(driver) {
  const title = await driver.getTitle();
  if (title !== 'Food Store') throw new Error(`Title mismatch: ${title}`);
  const logo = await driver.findElement(By.css('.logo')).getText();
  if (!logo.includes('Food Store')) throw new Error('Logo text missing');
  console.log('✔ Title and logo OK');
}

async function verifySearchVariants(driver) {
  const terms = ['Pizza', 'KFC', 'Burger'];
  for (const term of terms) {
    const input = await driver.findElement(By.css('.search'));
    await input.clear();
    await input.sendKeys(term);
    const btn = await driver.findElement(By.css('.search-btn'));
    await btn.click();

    await driver.wait(async () => {
      const meals = await driver.findElements(By.css('.meal'));
      for (const meal of meals) {
        const display = await meal.getCssValue('display');
        if (display !== 'none') {
          const title = await meal.findElement(By.css('.meal-title')).getText();
          return title.toLowerCase().includes(term.toLowerCase());
        }
      }
      return false;
    }, 5000);
    console.log(`✔ Search for ${term} OK`);
  }
}

async function verifyAddMultipleItemsAndCart(driver) {
  // add first two items
  const plusButtons = await driver.findElements(By.css('#plus'));
  if (plusButtons.length < 2) throw new Error('Not enough add buttons');
  // Some icons may not be directly interactable; use JS click to be robust
  await driver.executeScript('arguments[0].click();', plusButtons[0]);
  await driver.executeScript('arguments[0].click();', plusButtons[1]);

  // wait for cart items
  await driver.wait(async () => {
    const items = await driver.findElements(By.css('.cart-item'));
    return items.length >= 2;
  }, 5000, 'Expected at least 2 cart items');

  // open cart
  await driver.findElement(By.id('cart-icon')).click();
  await driver.wait(async () => {
    const cart = await driver.findElement(By.css('.cart'));
    const cls = await cart.getAttribute('class');
    return cls.includes('active');
  }, 3000);

  const totalText = await driver.findElement(By.css('.cart-total')).getText();
  if (!totalText.includes('$')) throw new Error('Cart total not updated');
  console.log('✔ Add multiple items & cart visible');
}

async function verifyQuantityChangeAndTotal(driver) {
  // increase quantity of first cart item
  const qtyInput = await driver.findElement(By.css('.cart-number'));
  await qtyInput.clear();
  await qtyInput.sendKeys('2');

  // compute expected total in page (the page logic adds +1 to quantity)
  const expected = await driver.executeScript(() => {
    const items = document.querySelectorAll('.cart-item');
    let total = 0;
    items.forEach((it) => {
      const price = it.querySelector('.cart-price').textContent.replace(/[^0-9.]/g, '');
      const qty = parseInt(it.querySelector('.cart-number').value) + 1;
      total += parseFloat(price) * qty;
    });
    return `Total: $${total.toFixed(2)}`;
  });

  await driver.wait(async () => {
    const txt = await driver.findElement(By.css('.cart-total')).getText();
    return txt === expected;
  }, 5000, 'Cart total did not match expected after quantity change');

  console.log('✔ Quantity change and total verified');
}

async function verifyRemoveItem(driver) {
  const before = await driver.findElements(By.css('.cart-item'));
  const trash = await driver.findElement(By.css('#trash-icon'));
  await trash.click();

  await driver.wait(async () => {
    const after = await driver.findElements(By.css('.cart-item'));
    return after.length === before.length - 1;
  }, 5000, 'Cart item was not removed');

  console.log('✔ Remove item verified');
}

async function verifyCheckoutAlert(driver) {
  // click Buy Now
  await driver.findElement(By.css('.cart-btn')).click();

  // handle alert
  await driver.wait(until.alertIsPresent(), 3000);
  const alert = await driver.switchTo().alert();
  const text = await alert.getText();
  const expected = 'Thank you for your purchase. Have a good lunch';
  if (text !== expected) throw new Error(`Alert text mismatch: ${text}`);
  await alert.accept();

  // cart should be cleared and total reset
  const total = await driver.findElement(By.css('.cart-total')).getText();
  if (!/Total:\s*\$\s*0/.test(total)) throw new Error('Cart total not reset after checkout');

  console.log('✔ Checkout alert and cart reset verified');
}

runFullTest().catch((err) => {
  console.error('❌ Full WebDriver test failed:');
  console.error(err);
  process.exit(1);
});
