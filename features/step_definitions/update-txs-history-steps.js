import { Given, Then, When } from 'cucumber';
import { By } from 'selenium-webdriver';
import chai from 'chai';
import { getLovefieldTxs, getMockData } from '../support/mockDataBuilder';

Given(/^The lovefield db has transactions$/, async function () {
  // TODO: Initialize Lovefield with some transactions stored
});

Then(/^I go to Txs History tab$/, async function () {
  const transactions = await this.getElementBy("//*[contains(text(), 'Transactions')]", By.xpath);
  await transactions.click();
});

When(/^I see the transactions summary$/, async function () {
  await this.waitForElement('.WalletSummary_numberOfTransactions');
});

Then(/^I should see that the number of transactions is ([^"]*)$/, async function (txsAmount) {
  await this.waitForElement('.WalletSummary_numberOfTransactions');
  const txsNumber = await this.getText('.WalletSummary_numberOfTransactions');
  chai.expect(txsNumber).to.equal('Number of transactions: ' + txsAmount);
});

Then(/^I should see the txs corresponding to prefix ([^"]*)$/, async function (addressPrefix) {
  const txsList = await this.getElementsBy('.Transaction_component');
  const addressMap = getMockData().addressesMapper
      .find((address => address.prefix === addressPrefix));
  const lovefieldTxs = addressMap && addressMap.hashPrefix && addressMap.txsAmount ?
    getLovefieldTxs(addressMap.txsAmount, addressPrefix, addressMap.hashPrefix) :
    getMockData().lovefieldTxs[addressPrefix];
  if (txsList.length > 1) {
    for (let i = 0; i < lovefieldTxs.length; i++) {
      this.clickDriverElement(txsList[i]);
      const txData = await txsList[i].getText();
      const txDataArray = txData.split('\n');
      chai.expect(txDataArray[0]).to.equal(lovefieldTxs[i].txType);
      chai.expect(txDataArray[1].split(' ')[0]).to.equal(lovefieldTxs[i].txAmount);
      chai.expect(txDataArray[2]).to.equal(lovefieldTxs[i].txTime);
      chai.expect(txDataArray[3]).to.equal(lovefieldTxs[i].txStatus);
      chai.expect(txDataArray[5]).to.equal(lovefieldTxs[i].txFrom[0]);
      chai.expect(txDataArray[7]).to.equal(lovefieldTxs[i].txTo[0]);
      chai.expect(txDataArray[9]).to.equal(lovefieldTxs[i].txConfirmations);
      chai.expect(txDataArray[11]).to.equal(lovefieldTxs[i].txId);
    }
  } else if (txsList.length > 0) {
    const tx = txsList[0];
    this.clickDriverElement(tx);
    const txData = await tx.getText();
    const txDataArray = txData.split('\n');
    chai.expect(txDataArray[0]).to.equal(lovefieldTxs[0].txType);
    chai.expect(txDataArray[1].split(' ')[0]).to.equal(lovefieldTxs[0].txAmount);
    chai.expect(txDataArray[2]).to.equal(lovefieldTxs[0].txTime);
    chai.expect(txDataArray[3]).to.equal(lovefieldTxs[0].txStatus);
    chai.expect(txDataArray[5]).to.equal(lovefieldTxs[0].txFrom[0]);
    chai.expect(txDataArray[6]).to.equal(lovefieldTxs[0].txFrom[1]);
    chai.expect(txDataArray[7]).to.equal(lovefieldTxs[0].txFrom[2]);
    chai.expect(txDataArray[9]).to.equal(lovefieldTxs[0].txTo[0]);
    chai.expect(txDataArray[10]).to.equal(lovefieldTxs[0].txTo[1]);
    chai.expect(txDataArray[11]).to.equal(lovefieldTxs[0].txTo[2]);
    chai.expect(txDataArray[12]).to.equal(lovefieldTxs[0].txTo[3]);
    chai.expect(txDataArray[14]).to.equal(lovefieldTxs[0].txConfirmations);
    chai.expect(txDataArray[16]).to.equal(lovefieldTxs[0].txId);
  }
});
