// @flow
import axios from 'axios';
import type Moment from 'moment';
import type { ConfigType } from '../../../../config/config-types';
import {
  Logger,
  stringifyError
} from '../../../utils/logging';
import {
  GetUtxosForAddressesApiError,
  GetUtxosSumsForAddressesApiError,
  GetTxHistoryForAddressesApiError,
  SendTransactionApiError,
  CheckAdressesInUseApiError,
  GetPendingTxsForAddressesApiError,
  InvalidWitnessError
} from '../errors';
import ca from '../../../../tls-files/ca.pem';
const https = require('https');

declare var CONFIG: ConfigType;
const backendUrl = CONFIG.network.backendUrl;

const instance = axios.create({
  httpsAgent: new https.Agent({ ca })
});

// TODO: Refactor service call in order to re-use common parameters

export const getUTXOsForAddresses = (addresses: Array<string>) =>
  instance.post('/api/txs/utxoForAddresses', { addresses }
  ).then(response => {
    console.log(response);
    return response.data;
  })
  .catch((error) => {
    Logger.error('yoroi-backend-api::getUTXOsForAddresses error: ' + stringifyError(error));
    throw new GetUtxosForAddressesApiError();
  });

export const getUTXOsSumsForAddresses = (addresses: Array<string>) =>
  instance.post('/api/txs/utxoSumForAddresses', { addresses }
  ).then(response => response.data)
  .catch((error) => {
    Logger.error('yoroi-backend-api::getUTXOsSumsForAddresses error: ' + stringifyError(error));
    throw new GetUtxosSumsForAddressesApiError();
  });

export const getTransactionsHistoryForAddresses = (addresses: Array<string>,
  dateFrom: Moment) =>
  instance.post(`${backendUrl}/api/txs/history`, {
    addresses,
    dateFrom
  }).then(response => {
    console.log(response);
    return response.data;
  })
  .catch((error) => {
    Logger.error('yoroi-backend-api::getTransactionsHistoryForAddresses error: ' + stringifyError(error));
    throw new GetTxHistoryForAddressesApiError();
  });

export const sendTx = (signedTx: string) =>
  instance.post('/api/txs/signed', { signedTx }
  ).then(response => response.data)
  .catch((error) => {
    Logger.error('yoroi-backend-api::sendTx error: ' + stringifyError(error));
    if (error.request.response.includes('Invalid witness')) {
      throw new InvalidWitnessError();
    }
    throw new SendTransactionApiError();
  });

export const checkAddressesInUse = (addresses: Array<string>) =>
  instance.post('/api/addresses/filterUsed', { addresses }
  ).then(response => response.data)
  .catch((error) => {
    Logger.error('yoroi-backend-api::checkAddressesInUse error: ' + stringifyError(error));
    throw new CheckAdressesInUseApiError();
  });

export const getPendingTxsForAddresses = (addresses: Array<string>) =>
  instance.post('/api/txs/pending', { addresses }
  ).then(response => response.data)
  .catch((error) => {
    Logger.error('yoroi-backend-api::getPendingTxsForAddresses error: ' + stringifyError(error));
    throw new GetPendingTxsForAddressesApiError();
  });
