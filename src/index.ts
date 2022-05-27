import { Browser, Builder } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";
import { appendSearchLog } from "./appendSearchLog";
import { screenshotMap } from "./screenshotMap";
import { searchCep } from "./searchCep";

async function start() {
  const webDriver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(
      new Options().windowSize({ width: 1092, height: 614 }).headless()
    )
    .build();

  const maxTryAmount = 5;
  let tryAmountCounter = 0;

  do {
    try {
      const address = await searchCep("04547-130", webDriver);

      await appendSearchLog(address);

      await screenshotMap(address, webDriver);

      break;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }

      tryAmountCounter++;
    }
  } while (tryAmountCounter < maxTryAmount);

  await webDriver.quit();
}

start();
