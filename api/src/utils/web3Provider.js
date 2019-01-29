const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const providerWithMnemonic = (mnemonic, rpcEndpoint) => {
  return new HDWalletProvider(mnemonic, rpcEndpoint);
};

const infuraProvider = () => {
  return providerWithMnemonic(
    process.env.MNEMONIC || '',
    `https://${process.env.NETWORK}.infura.io/${process.env.INFURA_API_KEY}`,
  );
};

exports.getWeb3Provider = () => {
  if (process.env.PROVIDER === 'infura') {
    return infuraProvider();
  }
  return new Web3.providers.HttpProvider('http://localhost:8545');
};
