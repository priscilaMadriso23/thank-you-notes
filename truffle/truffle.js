require('dotenv').config();

const HDWalletProvider = require('truffle-hdwallet-provider');

const providerWithMnemonic = (mnemonic, rpcEndpoint) => {
  return new HDWalletProvider(mnemonic, rpcEndpoint);
}

const infuraProvider = (network) => {
  return providerWithMnemonic(
    process.env.MNEMONIC || '',
    `https://${network}.infura.io/${process.env.INFURA_API_KEY}`,
  );
};

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
