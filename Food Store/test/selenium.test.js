const path = require('path');
const { Builder, By, until } = require('selenium-webdriver');
const safari = require('selenium-webdriver/safari');

async function runTest() {
  const options = new safari.Options();
  let driver;

  try {
    driver = await new Builder()
      .forBrowser('safari')
      .setSafariOptions(options)
      .build();
  } catch (err) {
    console.error('❌ Selenium test failed:');
    if (err.name === 'SessionNotCreatedError' || err.message.includes('Allow remote automation')) {
      console.error('Safari remote automation is not enabled.');
      console.error('Run `npm run enable-safari` and then enable "Allow Remote Automation" in Safari > Develop.');
    } else {
      console.error(err);
    }
    process.exit(1);
  }

  try {
    const fileUrl = `file://${path.resolve(__dirname, '../index.html')}`;
    await driver.get(fileUrl);

    await testPageTitleAndLogo(driver);
    await testSearchFiltering(driver);
    await testAddToCartAndCartVisibility(driver);

    console.log('✅ Selenium smoke test passed. All checks passed.');
  } finally {
    await driver.quit();
  }
}

async function testPageTitleAndLogo(driver) {
  const pageTitle = await driver.getTitle();
  if (pageTitle !== 'Food Store') {
    throw new Error(`Expected title 'Food Store', got '${pageTitle}'`);
  }

  const logo = await driver.findElement(By.css('.logo'));
  const logoText = await logo.getText();
  if (!logoText.includes('Food Store')) {
    throw new Error('Logo text does not contain Food Store');
  }

  console.log('✔ Page title and logo verified.');
}

async function testSearchFiltering(driver) {
  const searchInput = await driver.findElement(By.css('.search'));
  await searchInput.clear();
  await searchInput.sendKeys('Pizza');

  const searchButton = await driver.findElement(By.css('.search-btn'));
  await searchButton.click();

  await driver.wait(async () => {
    const meals = await driver.findElements(By.css('.meal'));
    for (const meal of meals) {
      const display = await meal.getCssValue('display');
      if (display !== 'none') {
        const title = await meal.findElement(By.css('.meal-title')).getText();
        return title.toLowerCase().includes('pizza');
      }
    }
    return false;
  }, 5000, 'Expected filtered meal result to include Pizza');

  console.log('✔ Search filtering verified.');
}

async function testAddToCartAndCartVisibility(driver) {
  const plusButtons = await driver.findElements(By.css('#plus'));
  if (plusButtons.length === 0) {
    throw new Error('No add-to-cart buttons found.');
  }

  await plusButtons[0].click();

  await driver.wait(async () => {
    const items = await driver.findElements(By.css('.cart-item'));
    return items.length > 0;
  }, 5000, 'Expected cart item to appear after adding a product');

  const cartIcon = await driver.findElement(By.id('cart-icon'));
  await cartIcon.click();

  await driver.wait(async () => {
    const cart = await driver.findElement(By.css('.cart'));
    const classValue = await cart.getAttribute('class');
    return classValue.includes('active');
  }, 5000, 'Expected cart panel to open after clicking cart icon');

  const cartTotal = await driver.findElement(By.css('.cart-total')).getText();
  if (!cartTotal.includes('$')) {
    throw new Error('Cart total did not update after adding a product.');
  }

  console.log('✔ Add to cart and cart visibility verified.');
}

runTest().catch((err) => {
  console.error('❌ Selenium test failed:');
  console.error(err);
  process.exit(1);
});
