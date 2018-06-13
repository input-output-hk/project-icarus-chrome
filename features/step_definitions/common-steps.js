import { BeforeAll, Given, After, AfterAll } from 'cucumber';
import { createServer } from '../support/mockServer';
import mockData from '../support/mockData.json';
import { getAddresses } from '../support/mockDataFunctions';

let server;

BeforeAll(() => {
  server = createServer();
});

AfterAll(() => {
  server.close();
});

After(async function () {
  await this.driver.quit();
});

Given(/^I have opened the chrome extension$/, async function () {
  await this.driver.get('chrome-extension://bflmcienanhdibafopagdcaaenkmoago/main_window.html');
});

Given(/^There is no wallet stored$/, async function () {
  await this.waitForElement('.WalletAddDialog');
});

Given(/^There is a wallet stored with ([^"]*) addresses$/, async function (addressAmount) {
  const { seed, wallet } = mockData;
  const addresses = getAddresses(addressAmount);
  this.saveToLocalStorage('ADDRESSES', addresses);
  this.saveToLocalStorage('SEED', seed);
  this.saveToLocalStorage('WALLET', wallet);
});
