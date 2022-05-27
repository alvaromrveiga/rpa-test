import { By, Key, until, WebDriver, WebElement } from "selenium-webdriver";
import fs from "fs";
import { getUrl } from "./utils/getUrl";

export async function screenshotMap(address: string, webDriver: WebDriver) {
  await getUrl(webDriver, "https://www.google.com.br/");

  await searchForAddress(webDriver, address);

  await clickOnMapsTab(webDriver);

  const canvas = await getMapCanvas(webDriver);

  await closeSideTab(webDriver);

  await waitCanvasFullyLoad(webDriver);

  await clickOnSatelliteViewButton(webDriver, canvas);

  await waitMapFullyLoad(webDriver);

  await takeAndSaveScreenshot(webDriver);
}

async function searchForAddress(driver: WebDriver, address: string) {
  try {
    await driver
      .findElement(By.xpath("//input[@name='q']"))
      .sendKeys(address, Key.RETURN);
  } catch (error) {
    throw new Error("Could not find the element to input the address");
  }
}

async function clickOnMapsTab(driver: WebDriver) {
  try {
    await driver
      .wait(
        until.elementLocated(
          By.xpath("//div[@class='hdtb-mitem']//a[text()='Maps']")
        ),
        5000
      )
      .click();
  } catch (error) {
    throw new Error("Could not find the Maps tab");
  }
}

async function getMapCanvas(driver: WebDriver): Promise<WebElement> {
  try {
    const canvas = await driver.wait(
      until.elementLocated(
        By.xpath("//canvas[@class='MyME0d widget-scene-canvas']")
      ),
      5000
    );

    await driver.wait(until.elementIsEnabled(canvas), 5000);

    await makeCanvasVisibleWhenHeadless(driver, canvas);

    return canvas;
  } catch (error) {
    throw new Error("Could not load map canvas");
  }
}

async function waitCanvasFullyLoad(driver: WebDriver) {
  try {
    const searchButtons = await driver.wait(
      until.elementLocated(
        By.xpath("//button[@class='tXNTee LCTIRd L6Bbsd Tc0rEd T7HQDc']")
      ),
      5000
    );

    await driver.wait(until.elementIsEnabled(searchButtons), 5000);
  } catch (error) {
    throw new Error("Could not fully load map canvas");
  }
}

async function calculateSatelliteViewButtonPosition(
  canvas: WebElement
): Promise<{ satelliteButtonX: number; satelliteButtonY: number }> {
  try {
    const canvasWidth: number = +(await canvas.getAttribute("width"));
    const canvasHeight: number = +(await canvas.getAttribute("height"));

    const satelliteButtonX = Math.ceil(
      0 - canvasWidth / 2 + canvasWidth * 0.06
    );

    const satelliteButtonY = Math.ceil(
      0 + canvasHeight / 2 - canvasHeight * 0.13
    );

    return { satelliteButtonX, satelliteButtonY };
  } catch (error) {
    throw new Error(
      "There was an error calculating the satellite view button position"
    );
  }
}

async function clickOnSatelliteViewButton(
  driver: WebDriver,
  canvas: WebElement
) {
  try {
    const { satelliteButtonX, satelliteButtonY } =
      await calculateSatelliteViewButtonPosition(canvas);

    const actions = driver.actions({ async: true });
    await actions
      .move({ origin: canvas, x: satelliteButtonX, y: satelliteButtonY })
      .click()
      .perform();
  } catch (error) {
    throw new Error("Could not click on the satellite view button");
  }
}

async function closeSideTab(driver: WebDriver) {
  try {
    const sideTabButtonDiv = await driver
      .findElement(By.xpath("//div[@class='gYkzb']"))
      .click();

    await waitCloseSideTabAnimation();
  } catch (error) {
    throw new Error("Could not close the side tab");
  }
}

async function waitCloseSideTabAnimation() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

async function waitMapFullyLoad(driver: WebDriver) {
  try {
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
  } catch (error) {
    throw new Error("Could not fully load map satellite view");
  }
}

async function makeCanvasVisibleWhenHeadless(
  driver: WebDriver,
  canvas: WebElement
) {
  try {
    const canvasStyle = await canvas.getAttribute("style");
    const canvasStyleDisplayInline = canvasStyle.replace("none", "inline");

    await driver.executeScript(
      `arguments[0].setAttribute('style', '${canvasStyleDisplayInline}')`,
      canvas
    );
  } catch (error) {
    throw new Error("Could not change canvas display to inline");
  }
}

async function takeAndSaveScreenshot(webDriver: WebDriver) {
  try {
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
  } catch (error) {
    throw new Error("Error while taking a screenshot of the map");
  }
}
