// @flow

import bip39 from 'bip39';
import { Blake2b, Wallet } from 'cardano-crypto';
import {
  encryptWithPassword,
  decryptWithPassword
} from '../../../utils/crypto/cryptoUtils';
import {
  blockchainNetworkConfig,
  NETWORK_MODE,
} from '../../../config/blockchainNetworkConfig';
import type { AdaWallet } from '../types';
import type { AdaWalletParams } from '../ada-methods';

export const generateAdaMnemonic = () => bip39.generateMnemonic(128).split(' ');

export const isValidAdaMnemonic = (
  phrase: string,
  numberOfWords: number = 12
) =>
  phrase.split(' ').length === numberOfWords && bip39.validateMnemonic(phrase);

/* @note: Ada wallet is the abstraction for Daedalus */
export function toAdaWallet({ walletPassword, walletInitData }: AdaWalletParams): AdaWallet {
  const { cwAssurance, cwName, cwUnit } = walletInitData.cwInitMeta;
  return {
    cwAccountsNumber: 1,
    cwAmount: {
      getCCoin: 0
    },
    cwHasPassphrase: !!walletPassword,
    cwId: '1111111111111111',
    cwMeta: {
      cwAssurance,
      cwName,
      cwUnit
    },
    cwPassphraseLU: new Date()
  };
}

export function generateWalletSeed(secretWords, password) {
  const entropy = bip39.mnemonicToEntropy(secretWords);
  const seed = Blake2b.blake2b_256(entropy);
  return {
    seed: password ? encryptWithPassword(password, seed) : seed
  };
}

/* @note: Crypto wallet is the abstraction provide for JS-wasm-cardano module */
export function getCryptoWalletFromSeed(walletSeed, password) {
  const seed = password ? decryptWithPassword(password, walletSeed.seed) : walletSeed.seed;
  const seedAsArray = Object.values(seed);
  const wallet = Wallet.fromSeed(seedAsArray).result;
  wallet.config.protocol_magic = blockchainNetworkConfig[NETWORK_MODE].PROTOCOL_MAGIC;
  return wallet;
}
