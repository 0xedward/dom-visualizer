const webdriver = require('selenium-webdriver');
const {By} = require('selenium-webdriver')
const driver = new webdriver.Builder().forBrowser("chrome").build();

//TESTS
testInput();

//TODO: Browser test inputs sample input and checks to see if elements are appended to SVG correctly
//Start test by using node testing/driver.js
async function testInput() {
  try {
    await driver.get("http://127.0.0.1:5500/");
    const inputText = (await driver).findElement(By.id("html-input-box"))
    const submitInput = (await driver).findElement(By.id("visualize-btn"))

    const sampleInput = "<test> <append>"
    inputText.sendKeys(sampleInput)

    await submitInput.click()

    const nodes = (await driver).findElement(By.xpath, '/html/body/div[2]/div[2]/svg/g/g[3]/rect')

    //expect(elem)
    await driver.quit()
  } catch (err) {
    handleError(err, driver);
  }
}

function handleError(err, driver) {
  console.error("Input not matched", err);
  driver.quit();
}
