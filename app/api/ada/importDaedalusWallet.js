
import base58 from 'bs58';
import {
  HdWallet,
  RandomAddressChecker
} from 'cardano-crypto';

export async function importDaedalusWallet(
  walletSeed: WalletSeed,
  receiverAddress: string,
  allAddresses: Array<String>
): void {
  const xprvArray = HdWallet.fromSeed(walletSeed.seed);
  const xprv = _toHexString(xprvArray);
  const checker = RandomAddressChecker.newChecker(xprv).result;
  // FIXME: allAddresses from base64 string to base58 string
  const walletAddresses = RandomAddressChecker.checkAddresses(checker, allAddresses);
  /*
    TODO: Generate a tx from all funds to the new address.
    Obs: Current method "newAdaTransaction" doesn't apply for doing this task.
  */
  debugger;
}

function _toHexString(byteArray) {
  return Array.from(byteArray, (byte) => (
    '0' + (byte & 0xFF).toString(16)).slice(-2)
  ).join('');
}
