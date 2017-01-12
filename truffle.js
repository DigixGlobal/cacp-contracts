const sigmate = require('./node_modules/@digix/sigmate');

module.exports = {
  networks: {
    testnet: sigmate.config({
      network_id: '3',
      rpcUrl: 'https://ropsten.infura.io/',
      keystore: {
        label: 'testing',
        password: 'testing',
      },
    }),
    development: sigmate.config({
      network_id: 'default',
      rpcUrl: 'http://localhost:6545',
    }),
  },
};
