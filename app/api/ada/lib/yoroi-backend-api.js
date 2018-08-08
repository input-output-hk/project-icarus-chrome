// @flow
import type Moment from 'moment';
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
  InvalidWitnessError
} from '../errors';
import { request } from './request';

// TODO: Refactor service call in order to re-use common parameters

export const getUTXOsForAddresses = (addresses: Array<string>) =>
  request(
    {
      method: 'POST',
      path: '/api/txs/utxoForAddresses'
    },
    { addresses }
  ).catch((error) => {
    Logger.error('yoroi-backend-api::getUTXOsForAddresses error: ' + stringifyError(error));
    throw new GetUtxosForAddressesApiError();
  });

export const getUTXOsSumsForAddresses = (addresses: Array<string>) =>
  request(
    {
      method: 'POST',
      path: '/api/txs/utxoSumForAddresses'
    },
    { addresses }
  ).catch((error) => {
    Logger.error('yoroi-backend-api::getUTXOsSumsForAddresses error: ' + stringifyError(error));
    throw new GetUtxosSumsForAddressesApiError();
  });

export const getTransactionsHistoryForAddresses = (addresses: Array<string>,
  dateFrom: Moment) =>
  request(
    {
      method: 'POST',
      path: '/api/txs/history'
    },
    { addresses, dateFrom }
  ).catch((error) => {
    Logger.error('yoroi-backend-api::getTransactionsHistoryForAddresses error: ' + stringifyError(error));
    throw new GetTxHistoryForAddressesApiError();
  });

export const sendTx = (signedTx: string) =>
  request(
    {
      method: 'POST',
      path: '/api/txs/signed'
    },
    { signedTx }
  ).catch((error) => {
    Logger.error('yoroi-backend-api::sendTx error: ' + stringifyError(error));
    if (error.request.response.includes('Invalid witness')) {
      throw new InvalidWitnessError();
    }
    throw new SendTransactionApiError();
  });

export const checkAddressesInUse = (addresses: Array<string>) =>
  request(
    {
      method: 'POST',
      path: '/api/addresses/filterUsed'
    },
    { addresses }
  ).catch((error) => {
    Logger.error('yoroi-backend-api::checkAddressesInUse error: ' + stringifyError(error));
    throw new CheckAdressesInUseApiError();
  });
