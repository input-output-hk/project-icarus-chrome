import { importDaedalusWallet } from '../importDaedalusWallet';

// TODO: add 'api' config and export in a different file this object
const config = {
  ws: {
    route: 'localhost',
    port: 8080,
    secure: false,
  },
};

const MSG_TYPE_RESTORE = 'RESTORE';

export function setupWs(walletSeed: WalletSeed, receiverAddress: string) {
  const ws = new WebSocket(getWSServiceURL(config.ws));

  ws.addEventListener('open', () => {
    console.log('[ws::connected]');

    // TODO: Trigger this when the user start Daedalus wallet restoration
    ws.send(toMessage({
      msg: MSG_TYPE_RESTORE,
    }));
  });

  ws.addEventListener('message', (msg) => {
    const data = fromMessage(msg.data);
    console.log(`[ws::message] on: ${data.msg}`);
    switch (data.msg) {
      case MSG_TYPE_RESTORE:
        // console.log(`[ws::message] ${MSG_TYPE_RESTORE} - step ${data.step}`, data.addresses);
        importDaedalusWallet(walletSeed, receiverAddress, data.addresses);
        break;
      default:
        break;
    }
  });

  ws.addEventListener('closed', () => {
    console.log('[ws::connected]');
  });

  return ws;
}

const fromMessage = JSON.parse;

const toMessage = JSON.stringify;

function getWSServiceURL(wsConfig) {
  return `ws${wsConfig.secure ? 's' : ''}://${wsConfig.route}:${wsConfig.port}`;
}
