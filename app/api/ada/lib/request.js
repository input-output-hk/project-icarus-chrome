// @flow
import https from 'https';
import tls from 'tls';
import devCA from '../../../../tls-files/ca.pem';

declare var CONFIG: ConfigType;
const backendUrl = CONFIG.network.backendUrl;

export type RequestOptions = {
  method: string,
  path: string,
  headers?: {
    'Content-Type': string,
    'Content-Length': number,
  },
};

const FINGERPRINTSET = [
  'CF:05:98:89:CA:FF:8E:D8:5E:5C:E0:C2:E4:F7:E6:C3:C7:50:DD:5C'
];

function checkServerIdentity(host, cert) {
  // Make sure the certificate is issued to the host we are connected to
  console.log(cert.fingerprint256);
  const err = tls.checkServerIdentity(host, cert);
  if (err) {
    return err;
  }

  // Pin the exact certificate, rather then the pub key
  const cert256 = '25:FE:39:32:D9:63:8C:8A:FC:A1:9A:29:87:' +
    'D8:3E:4C:1D:98:DB:71:E4:1A:48:03:98:EA:22:6A:BD:8B:93:16';
  if (cert.fingerprint256 !== cert256) {
    const msg = 'Certificate verification error: ' +
      `The certificate of '${cert.subject.CN}' ` +
      'does not match our pinned fingerprint';
    return new Error(msg);
  }

  console.log('Subject Common Name:', cert.subject.CN);
  console.log('  Certificate SHA256 fingerprint:', cert.fingerprint256);

}

export function request(
  httpOptions: RequestOptions, rawBodyParams?: any
): Promise<any> {
  return new Promise((resolve) => {
    const [backendHost, backendPort] = backendUrl.substr(8).split(':');
    const options = Object.assign({}, httpOptions, { hostname: backendHost, port: backendPort, checkServerIdentity });
    let hasRequestBody = false;
    let requestBody = '';

    // Handle raw body params
    if (rawBodyParams) {
      hasRequestBody = true;
      requestBody = JSON.stringify(rawBodyParams);
      options.headers = {
        'Content-Length': (new TextEncoder()).encode(requestBody).length,
        'Content-Type': 'application/json',
      };
    }

    options.agent = new https.Agent(options);
    console.log(options);
    const httpsRequest = https.request(options);
    if (hasRequestBody) {
      httpsRequest.write(requestBody);
    }
    httpsRequest.on('socket', socket => {
      socket.on('secureConnect', () => {
        const fingerprint = socket.getPeerCertificate().fingerprint;
    
        // Check if certificate is valid
        if (socket.authorized === false) {
          console.log('https abort');
          httpsRequest.emit('error', new Error(socket.authorizationError));
          return httpsRequest.abort();
        }
    
        // Match the fingerprint with our saved fingerprints only for a new tls session
        if (FINGERPRINTSET.indexOf(fingerprint) === -1 && !socket.isSessionReused()) {
          console.log('https abort');
          // Abort request, optionally emit an error event
          httpsRequest.emit('error', new Error('Fingerprint does not match'));
          return httpsRequest.abort();
        }
      });
    });
    httpsRequest.on('response', (response) => {
      let body = '';
      response.on('data', (chunk) => (body += chunk));
      response.on('error', (error) => { throw error; });
      response.on('end', () => {
        try {
          const parsedBody = JSON.parse(body);
          resolve(parsedBody);
        } catch (error) {
          throw error;
        }
      });
    });
    httpsRequest.on('error', (error) => { throw error; });
    httpsRequest.end();
  });
}
