import { By, Key, until, WebDriver } from "selenium-webdriver";
import { getUrl } from "./utils/getUrl";

export async function searchCep(
  cep: string,
  webDriver: WebDriver
): Promise<string> {
  await getUrl(
    webDriver,
    "https://buscacepinter.correios.com.br/app/endereco/index.php"
  );

  await inputCep(webDriver, cep);

  await waitCepResults(webDriver);

  const address = await getAddress(webDriver);

  return address;
}

async function inputCep(webDriver: WebDriver, cep: string) {
  try {
    await webDriver.findElement(By.id("endereco")).sendKeys(cep, Key.RETURN);
  } catch (error) {
    throw new Error("Could not find the element to input the CEP");
  }
}

async function waitCepResults(webDriver: WebDriver) {
  try {
    await webDriver.wait(
      until.elementTextIs(
        webDriver.findElement(By.id("mensagem-resultado")),
        "Resultado da Busca por Endereço ou CEP"
      ),
      5000
    );
  } catch (error) {
    throw new Error("Could not find the CEP results");
  }
}

async function getAddress(webDriver: WebDriver): Promise<string> {
  try {
    const address = await webDriver
      .findElement(By.id("resultado-DNEC"))
      .findElement(By.css("tbody"))
      .getText();

    return address;
  } catch (error) {
    throw new Error("Could not find this CEP's address");
  }
}
