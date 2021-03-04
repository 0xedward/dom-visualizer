import webdriver from "selenium-webdriver";
const driver = new webdriver.Builder().forBrowser("chrome").build();

// //TESTS
testInput();
async function testInput() {
  try {
    await driver.get("http://127.0.0.1:5500/");
    driver.findElement(By.id("html-input-box"));
  } catch (err) {
    handleError(err, driver);
  }
}

function handleError(err, driver) {
  console.error("Input not matched", err);
  driver.quit();
}
