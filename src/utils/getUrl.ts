import { WebDriver } from "selenium-webdriver";

export async function getUrl(webDriver: WebDriver, url: string) {
  try {
    await webDriver.get(url);
  } catch (error) {
    throw new Error(
      `Unable to get ${url}, please check your internet connection`
    );
  }
}
