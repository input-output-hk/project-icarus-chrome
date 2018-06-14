const moment = require('moment');

export function getAddresses(addressAmount, addressPrefix) {
  return _generateListOfStrings(addressPrefix)
    .slice(0, addressAmount).reduce((newAddresses, address) => {
      newAddresses[address] = {
        cadAmount: {
          getCCoin: 0
        },
        cadId: address,
        cadIsUsed: false,
        account: 0,
        change: 0,
        index: 0
      };
      return newAddresses;
    }, {});
}

export function getTxs(txsAmount, addressPrefix, hashPrefix) {
  const initialTime = '2018-05-10T13:51:33.000Z';
  return _generateListOfStrings(hashPrefix)
    .slice(0, txsAmount).map((txHash, index) => {
      const oddIndex = index % 2 !== 0;
      const addresses = [
        addressPrefix + 'W',
        'Ae2tdPwUPEZASB8nPKk1VsePbQZY8ZVv4mGebJ4UwmSBhRo9oR9Eqkzyxwv',
        'Ae2tdPwUPEZASB8nPKk1VsePbQZY8ZVv4mGebJ4UwmSBhRo9oR9Eqkabcde'
      ];
      const amounts = [200 + index, 100, 100 + index];
      const inputsAddress = oddIndex ? addresses.slice(0, 1) : addresses.slice(1, 3);
      const inputsAmount = oddIndex ? amounts.slice(0, 1) : amounts.slice(1, 3);
      const outputsAddress = oddIndex ? addresses.slice(1, 3) : addresses.slice(0, 1);
      const outputsAmount = oddIndex ? amounts.slice(1, 3) : amounts.slice(0, 1);
      return {
        hash: txHash,
        time: moment(initialTime).add(index, 'h').toISOString(),
        inputs_address: inputsAddress,
        inputs_amount: inputsAmount,
        outputs_address: outputsAddress,
        outputs_amount: outputsAmount,
        block_num: 2 + index
      };
    });
}

export function getTxAddresses(txsAmount, addressPrefix, hashPrefix) {
  return _generateListOfStrings(hashPrefix)
    .slice(0, txsAmount).map(txHash => ({
      address: addressPrefix + 'W',
      tx_hash: txHash
    }));
}

function _generateListOfStrings(prefix) {
  const listOfStrings = [];
  // Generates strings ending with A-Z
  for (let i = 65; i < 90; i++) {
    listOfStrings.push(prefix + String.fromCharCode(i));
  }
  // Generates strings ending with a-z
  for (let i = 97; i < 122; i++) {
    listOfStrings.push(prefix + String.fromCharCode(i));
  }
  return listOfStrings;
}
