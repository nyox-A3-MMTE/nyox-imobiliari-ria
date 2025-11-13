import { BeforeAll, AfterAll } from "@cucumber/cucumber";
import app from "../../src/index.js";

let serverInstance;

BeforeAll(async function () {
  await new Promise(resolve => {
    serverInstance = app.listen(0, resolve);
  });
});

AfterAll(async function () {
  if (serverInstance) {
    await new Promise(resolve => serverInstance.close(resolve));
  }
});

export { serverInstance };
