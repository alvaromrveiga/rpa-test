import fs from "fs";

export async function appendSearchLog(address: string) {
  const now = new Date(Date.now());

  fs.appendFile(
    "searchLog.txt",
    now.toLocaleDateString("pt-BR", { dateStyle: "short", timeStyle: "long" }) +
      ": " +
      address +
      "\n",
    () => {
      console.log(address);
    }
  );
}
