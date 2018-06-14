import aesjs from 'aes-js';
import { loadRustModule } from 'rust-cardano-crypto';
import { getWalletSeed } from './api/ada/adaWallet';
import { getCryptoWalletFromSeed } from './api/ada/lib/crypto-wallet';
import { mapToList } from './api/ada/lib/utils';
import { newAdaAddress, getAdaAddressesMap } from './api/ada/adaAddress';
import { ACCOUNT_INDEX, getCryptoAccount } from './api/ada/adaAccount';
import { getAdaTransactionFromSenders } from './api/ada/adaTransactions/adaNewTransactions';
import { setupApi } from './api/index';

const CONFIRMATION_TIME = 60 * 1000;

function _logIfDebugging(debugging) {
  function printMsg(msg) {
    if (debugging) {
      console.log(msg);
    }
  }
  return printMsg;
}

function addNewAddress(cryptoAccount) {
  const addresses = mapToList(getAdaAddressesMap());
  return newAdaAddress(cryptoAccount, addresses, 'External');
}

export async function generateStx(password, numberOfTxs, debugging = true) {
  await loadRustModule();
  const log = _logIfDebugging(debugging);
  const api = setupApi();

  log('[generateStx] Starting generating stxs');

  const wallets = [];
  const seed = getWalletSeed();
  const cryptoWallet = getCryptoWalletFromSeed(seed, password);
  const cryptoAccount = getCryptoAccount(cryptoWallet, ACCOUNT_INDEX);

  for (let i = 0; i < numberOfTxs; i++) {
    const newAddress = addNewAddress(cryptoAccount);
    wallets.push(newAddress);
    log(`[generateStx] Generated ${newAddress.cadId}`);
  }

  log('[generateStx] Generated wallets');

  for (let i = 0; i < numberOfTxs; i++) {
    const newWalletAddr = wallets[i].cadId;
    const backendResponse = await api.ada.createTransaction(
      { receiver: newWalletAddr, amount: '180000', password }
    );

    log(`[generateStx] Sent tx with receiver ${newWalletAddr} and response ${backendResponse}`);
  }

  log('[generateStx] Sent all txs, waiting for txs to be confirmed');
  await new Promise(resolve => setTimeout(resolve, CONFIRMATION_TIME));

  log('[generateStx] Starting creating txs');
  const newAddress = addNewAddress(cryptoAccount).cadId;
  for (let i = 0; i < numberOfTxs; i++) {
    const sender = wallets[i];
    const createSTxRes = await getAdaTransactionFromSenders(
      [sender],
      newAddress,
      '1',
      password
    );
    const stx = createSTxRes[0].result.cbor_encoded_tx;
    const encodedSTx = aesjs.utils.hex.fromBytes(stx);

    if (!debugging) {
      console.log(`${encodedSTx}`);
    }
    log(`[generateStx] Created stx ${encodedSTx} from ${sender.cadId} to ${newAddress}`);
  }

  log('[generateStx] Created stxs');
}
