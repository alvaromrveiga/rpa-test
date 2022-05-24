import { Browser, Builder } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";
import { screenshotMap } from "./screenshotMap";
import { searchCep } from "./searchCep";

async function start() {
  const driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(new Options().headless())
    .build();

  try {
    const address = await searchCep("04547-130", driver);

    console.log(address);

    await screenshotMap(address, driver);
  } finally {
    await driver.quit();
  }
}

start();
