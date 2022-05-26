import { By, Key, until, WebDriver } from "selenium-webdriver";

export async function screenshotMap(address: string, driver: WebDriver) {
  try {
    await driver.get("https://www.google.com.br/");

    await driver
      .findElement(By.xpath("//input[@name='q']"))
      .sendKeys(address, Key.RETURN);

    await driver
      .wait(
        until.elementLocated(
          By.xpath("//div[@class='hdtb-mitem']//a[text()='Maps']")
        ),
        5000
      )
      .click();

    const canvas = await driver.wait(
      until.elementLocated(
        By.xpath("//canvas[@class='MyME0d widget-scene-canvas']")
      ),
      5000
    );

    await driver.wait(
      until.elementLocated(
        By.xpath("//button[@class='tXNTee LCTIRd L6Bbsd Tc0rEd T7HQDc']")
      ),
      5000
    );

    const placeInfoTab = await driver.findElement(
      By.xpath("//div[@class='w6VYqd']")
    );

    const placeInfoTabWidth = (await placeInfoTab.getRect()).width;

    const canvasWidth: number = +(await canvas.getAttribute("width"));
    const canvasHeight: number = +(await canvas.getAttribute("height"));

    const satelliteButtonX = Math.ceil(
      0 - canvasWidth / 2 + placeInfoTabWidth + canvasWidth * 0.06
    );

    const satelliteButtonY = Math.ceil(
      0 + canvasHeight / 2 - canvasHeight * 0.13
    );

    const actions = driver.actions({ async: true });
    await actions
      .move({ origin: canvas, x: satelliteButtonX, y: satelliteButtonY })
      .click()
      .perform();
  } catch (error) {
    console.log(error);
  }
}
