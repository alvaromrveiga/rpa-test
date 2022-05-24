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
  } catch (error) {
    console.log(error);
  }
}
