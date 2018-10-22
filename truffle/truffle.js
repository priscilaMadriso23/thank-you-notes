const { infuraProvider } = require('./utils/web3Provider');

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
    },
    kovan: {
      provider: infuraProvider('kovan'),
      network_id: 42,
      gas: 4500000,
      gasPrice: 21,
    },
  },
};
