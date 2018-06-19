import { BeforeAll, Given, After, AfterAll } from 'cucumber';
import { createServer } from '../support/mockServer';
import { buildMockData, getMockData, getAddresses } from '../support/mockDataBuilder';

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

Given(/^I am testing "([^"]*)"$/, feature => {
  buildMockData(feature);
});

Given(/^I have opened the chrome extension$/, async function () {
  await this.driver.get('chrome-extension://bflmcienanhdibafopagdcaaenkmoago/main_window.html');
});

Given(/^There is no wallet stored$/, async function () {
  await this.waitForElement('.WalletAddDialog');
});

Given(/^There is a wallet stored( with ([^"]*) addresses)?( starting with ([^"]*))?$/,
  async function (addressAmount, addressPrefix) {
    const { seed, wallet, addressesMapper } = getMockData();
    const address = addressesMapper &&
      addressesMapper.find((addr => addr.prefix === addressPrefix));
    const prefix = address ? address.prefix : undefined;
    const addresses = getAddresses(addressAmount, prefix);
    this.saveToLocalStorage('ADDRESSES', addresses);
    this.saveToLocalStorage('SEED', seed);
    this.saveToLocalStorage('WALLET', wallet);
    await this.waitForElement('.TopBar_walletName');
  }
);
