// @flow
import {
  HdWallet,
  RandomAddressChecker
} from 'rust-cardano-crypto';
import {
  generateDaedalusSeed
} from './lib/crypto-wallet';

export function importDaedalusWallet(
  secretWords: string,
  receiverAddress: string,
  allAddresses: Array<string>
): void {
  const seed = generateDaedalusSeed(secretWords);
  debugger; // before crash
  const xprv = HdWallet.fromDaedalusSeed(seed);
  debugger; // after crash
  const xprvHex = Buffer.from(xprv).toString('hex');
  const checker = RandomAddressChecker.newChecker(xprvHex).result;
  const walletAddresses = RandomAddressChecker.checkAddresses(checker, allAddresses);
  console.log('[importDaedalusWallet] Daedalues wallet addresses:', walletAddresses);
  /*
    TODO: Generate a tx from all funds to the new address.
    Obs: Current method "newAdaTransaction" doesn't apply for doing this task.
  */
}
