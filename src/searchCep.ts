import { By, Key, until, WebDriver } from "selenium-webdriver";

export async function searchCep(
  cep: string,
  driver: WebDriver
): Promise<string> {
  try {
    await driver.get(
      "https://buscacepinter.correios.com.br/app/endereco/index.php"
    );

    await driver.findElement(By.id("endereco")).sendKeys(cep, Key.RETURN);

    await driver.wait(
      until.elementTextIs(
        driver.findElement(By.id("mensagem-resultado")),
        "Resultado da Busca por Endereço ou CEP"
      ),
      5000
    );

    const address = await driver
      .findElement(By.id("resultado-DNEC"))
      .findElement(By.css("tbody"))
      .getText();

    return address;
  } catch (error) {
    throw new Error("Could not find CEP");
  }
}
