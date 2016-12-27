const sigmate = require('./node_modules/@digix/sigmate');
module.exports = sigmate.truffle({
  networks: {
    morden: {
      network_id: 2,
      providerUrl: 'https://ropsten.infura.io/ftFX2a6rGHbiA45c6m0r',
      // providerUrl: 'http://localhost:8545',
      gas: 3000000,
      keystore: {
        label: 'testing',
        password: 'testing',
      },
    },
    test: {
      port: 6545,
    },
    development: {
      network_id: 'default',
      port: 6545,
    },
  },
  rpc: {
    host: 'localhost',
    port: 8545,
  },
});
