import { By, Key, until, WebDriver, WebElement } from "selenium-webdriver";
import fs from "fs";

export async function screenshotMap(address: string, webDriver: WebDriver) {
  try {
    await webDriver.get("https://www.google.com.br/");

    await searchForAddress(webDriver, address);

    await clickOnMapsTab(webDriver);

    const canvas = await getMapCanvas(webDriver);

    await closeSideTab(webDriver);

    await waitCanvasFullyLoad(webDriver);

    await clickOnSatelliteViewButton(webDriver, canvas);

    await waitMapFullyLoad(webDriver);

    await takeAndSaveScreenshot(webDriver);
  } catch (error) {
    console.log(error);
  }
}

async function searchForAddress(driver: WebDriver, address: string) {
  await driver
    .findElement(By.xpath("//input[@name='q']"))
    .sendKeys(address, Key.RETURN);
}

async function clickOnMapsTab(driver: WebDriver) {
  await driver
    .wait(
      until.elementLocated(
        By.xpath("//div[@class='hdtb-mitem']//a[text()='Maps']")
      ),
      5000
    )
    .click();
}

async function getMapCanvas(driver: WebDriver): Promise<WebElement> {
  const canvas = await driver.wait(
    until.elementLocated(
      By.xpath("//canvas[@class='MyME0d widget-scene-canvas']")
    ),
    5000
  );

  await driver.wait(until.elementIsEnabled(canvas), 5000);

  await makeCanvasVisibleWhenHeadless(driver, canvas);

  return canvas;
}

async function waitCanvasFullyLoad(driver: WebDriver) {
  const searchButtons = await driver.wait(
    until.elementLocated(
      By.xpath("//button[@class='tXNTee LCTIRd L6Bbsd Tc0rEd T7HQDc']")
    ),
    5000
  );

  await driver.wait(until.elementIsEnabled(searchButtons), 5000);
}

async function calculateSatelliteViewButtonPosition(
  canvas: WebElement
): Promise<{ satelliteButtonX: number; satelliteButtonY: number }> {
  const canvasWidth: number = +(await canvas.getAttribute("width"));
  const canvasHeight: number = +(await canvas.getAttribute("height"));

  const satelliteButtonX = Math.ceil(0 - canvasWidth / 2 + canvasWidth * 0.06);

  const satelliteButtonY = Math.ceil(
    0 + canvasHeight / 2 - canvasHeight * 0.13
  );

  return { satelliteButtonX, satelliteButtonY };
}

async function clickOnSatelliteViewButton(
  driver: WebDriver,
  canvas: WebElement
) {
  const { satelliteButtonX, satelliteButtonY } =
    await calculateSatelliteViewButtonPosition(canvas);

  const actions = driver.actions({ async: true });
  await actions
    .move({ origin: canvas, x: satelliteButtonX, y: satelliteButtonY })
    .click()
    .perform();
}

async function closeSideTab(driver: WebDriver) {
  const sideTabButtonDiv = await driver
    .findElement(By.xpath("//div[@class='gYkzb']"))
    .click();

  await waitCloseSideTabAnimation();
}

async function waitCloseSideTabAnimation() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

async function waitMapFullyLoad(driver: WebDriver) {
  const mapImageCredits = await driver.findElement(
    By.xpath("//span[@id='LFaNsb']")
  );

  const mapImageDefaultText = await mapImageCredits.getText();
  const endsWithCommaDefaultTextRegex = new RegExp(
    `.*\\, ${mapImageDefaultText}$`
  );

  await driver.wait(
    until.elementTextMatches(mapImageCredits, endsWithCommaDefaultTextRegex),
    10000
  );
}

async function makeCanvasVisibleWhenHeadless(
  driver: WebDriver,
  canvas: WebElement
) {
  const canvasStyle = await canvas.getAttribute("style");
  const canvasStyleDisplayInline = canvasStyle.replace("none", "inline");

  await driver.executeScript(
    `arguments[0].setAttribute('style', '${canvasStyleDisplayInline}')`,
    canvas
  );
}

async function takeAndSaveScreenshot(webDriver: WebDriver) {
  const screenshot = await webDriver.takeScreenshot();

  const screenshotName = new Date(Date.now())
    .toLocaleDateString("pt-br", {
      dateStyle: "short",
      timeStyle: "medium",
    })
    .replace(/[\s\/]/g, "-");

  await fs.writeFile(
    `screenshots/${screenshotName}.png`,
    Buffer.from(screenshot, "base64"),
    () => {}
  );
}
