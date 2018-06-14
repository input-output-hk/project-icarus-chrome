import { Given, Then, When } from 'cucumber';
import { By } from 'selenium-webdriver';
import chai from 'chai';

Given(/^The number of local transactions is ([^"]*)$/, async function () {
  // TODO: Initialize Lovefield with some transactions stored
});

When(/^I see the transactions summary$/, async function () {
  await this.waitForElement('.WalletSummary_numberOfTransactions');
});

Then(/^I should see that the number of transactions is ([^"]*)$/, async function (txsAmount) {
  await this.waitForElement('.WalletSummary_numberOfTransactions');
  const txsNumber = await this.getText('.WalletSummary_numberOfTransactions');
  chai.expect(txsNumber).to.equal('Number of transactions: ' + txsAmount);
});

/* FIXME: Should verify the information matches the mockData information.
    Also, findElements method should be in webdriver file */
Then(/^I should see the information$/, async function () {
  const txsList = await this.driver.findElements(By.css('.Transaction_component'));
  txsList.forEach(async (tx, index) => {
    const txData = await tx.getText();
    console.log(txData);
  });
});
