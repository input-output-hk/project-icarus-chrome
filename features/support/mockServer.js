import { create, bodyParser, defaults } from 'json-server';
import mockData from './mockData.json';

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
    res.send();
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
