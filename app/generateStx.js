import aesjs from 'aes-js';
import { getWalletSeed } from './api/ada/adaWallet';
import { getCryptoWalletFromSeed } from './api/ada/lib/crypto-wallet';
import { mapToList } from './api/ada/lib/utils';
import { newAdaAddress, getAdaAddressesMap } from './api/ada/adaAddress';
import { ACCOUNT_INDEX, getCryptoAccount } from './api/ada/adaAccount';
import { getAdaTransaction } from './api/ada/adaTransactions/adaNewTransactions';

function _logIfDebugging(debugging) {
  function printMsg(msg) {
    if (debugging) {
      console.log(msg);
    }
  }
  return printMsg;
}

export async function generateStx(password, numberOfTxs, amount, debugging = true) {
  const log = _logIfDebugging(debugging);

  log('[generateStx] Starting generating stxs');

  const wallets = [];
  const seed = getWalletSeed();
  const cryptoWallet = getCryptoWalletFromSeed(seed, password);
  const cryptoAccount = getCryptoAccount(cryptoWallet, ACCOUNT_INDEX);
  for (let i = 0; i < numberOfTxs; i++) {
    const addresses = mapToList(getAdaAddressesMap());
    const newAddress = newAdaAddress(cryptoAccount, addresses, 'External');
    wallets.push(newAddress);
    log(`[generateStx] Generated ${newAddress.cadId}`);
  }

  log('[generateStx] Generated wallets');

  for (let i = 0; i < numberOfTxs; i++) {
    const receiver = wallets[i].cadId;
    const createTxRes = await getAdaTransaction(receiver, amount, password);
    const tx = createTxRes[0].result.cbor_encoded_tx;
    const encodedTx = aesjs.utils.hex.fromBytes(tx);

    if (!debugging) {
      console.log(`${encodedTx}`);
    }
    log(`[generateStx] Generated tx ${encodedTx} with receiver ${receiver}`);
  }

  log('[generateStx] Sent txs');
  log('[generateStx] Created stxs');
}
