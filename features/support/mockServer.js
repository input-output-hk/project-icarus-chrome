import { create, bodyParser, defaults } from 'json-server';
import mockData from './mockData.json';
import { getTxs, getTxAddresses } from './mockDataFunctions';

const moment = require('moment');

const middlewares = [...defaults(), bodyParser];

const port = 8080;

export function createServer() {
  const server = create();

  server.use(middlewares);

  function validateAddressesReq({ addresses } = {}) {
    if (!addresses || addresses.length > 20 || addresses.length === 0) {
      throw new Error('Addresses request length should be (0, 20]');
    }
    // TODO: Add address validation
    return true;
  }

  function validateDatetimeReq({ dateFrom } = {}) {
    if (!dateFrom || !moment(dateFrom).isValid()) {
      throw new Error('DateFrom should be a valid datetime');
    }
    return true;
  }

  server.post('/api/txs/utxoForAddresses', (req, res) => {
    // TODO: Implement
    res.send();
  });

  server.post('/api/txs/utxoSumForAddresses', (req, res) => {
    validateAddressesReq(req.body);
    const sumUtxos = mockData.utxos.reduce((sum, utxo) => {
      if (req.body.addresses.includes(utxo.receiver)) {
        return sum + utxo.amount;
      }
      return sum;
    }, 0);
    res.send({ sum: sumUtxos });
  });

  server.post('/api/txs/history', (req, res) => {
    validateAddressesReq(req.body);
    validateDatetimeReq(req.body);
    // FIXME: Simplify logic
    const firstAddress = req.body.addresses[0];
    const addressPrefix = firstAddress.slice(0, firstAddress.length - 1);
    const addressMap = mockData.addressesMapper
      .find((address => address.prefix === addressPrefix));
    const txsAmount = addressMap.txsAmount;
    const hashPrefix = addressMap.hashPrefix;
    // Searches for txs hashes of the given addresses
    const txsHashes = getTxAddresses(txsAmount, addressPrefix, hashPrefix)
      .filter(txAddress => req.body.addresses.includes(txAddress.address))
      .map(txAddress => txAddress.tx_hash);
    // Filters all txs according to hash and date
    const filteredTxs = getTxs(txsAmount, addressPrefix, hashPrefix).filter(tx => {
      const extraFilter = req.body.txHash ?
        tx.hash > req.body.txHash :
        !req.body.txHash;
      return txsHashes.includes(tx.hash) &&
        moment(tx.time) >= moment(req.body.dateFrom) &&
        extraFilter;
    });
    // Returns a chunk of 20 txs, with the best block num and sorted
    const txsChunk = filteredTxs.slice(0, 20);
    const txsWithBlockNumber = txsChunk.map(txFromChunk => {
      const txWithBlockNumber = Object.assign({}, txFromChunk);
      txWithBlockNumber.best_block_num = mockData.bestblock[0].best_block_num;
      return txWithBlockNumber;
    });
    const txs = txsWithBlockNumber.sort((txA, txB) => {
      if (moment(txA.time) < moment(txB.time)) return -1;
      if (moment(txA.time) > moment(txB.time)) return 1;
      if (txA.hash < txB.hash) return -1;
      if (txA.hash > txB.hash) return 1;
      return 0;
    });
    res.send(txs);
  });

  server.post('/api/txs/signed', (req, res) => {
    // TODO: Implement
    res.send();
  });

  server.post('/api/addresses/filterUsed', (req, res) => {
    const usedAddresses = mockData.usedAddresses.filter((address) =>
      req.body.addresses.includes(address));
    res.send(usedAddresses);
  });

  return server.listen(port, () => {
    console.log(`JSON Server is running at ${port}`);
  });
}
