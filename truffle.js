const sigmate = require('./node_modules/@digix/sigmate');

module.exports = {
  networks: {
    testnet: sigmate.config({
      network_id: '3',
      prefund: 1e18, // 1 ether from coinbase to each account
      rpcUrl: 'https://ropsten.infura.io/',
      keystore: {
        label: 'testing',
        password: 'testing',
      },
    }),
    development: sigmate.config({
      network_id: 'default',
      prefund: 10e18,
      // virtual: true,
      // prefund: true,
      rpcUrl: 'http://localhost:6545',
      keystore: {
        label: 'testing',
        password: 'testing',
      },
    }),
  },
};
