require('dotenv').config();

const HDWalletProvider = require('truffle-hdwallet-provider');

const providerWithMnemonic = (mnemonic, rpcEndpoint) => {
  return new HDWalletProvider(mnemonic, rpcEndpoint);
};

exports.infuraProvider = (network) => {
  return providerWithMnemonic(
    process.env.MNEMONIC || '',
    `https://${network}.infura.io/${process.env.INFURA_API_KEY}`,
  );
};
