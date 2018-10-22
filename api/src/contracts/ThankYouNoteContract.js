const TruffleContract = require('truffle-contract');
const moment = require('moment');
const _ = require('lodash');
const BigNumber = require('bignumber.js');
const { getWeb3Provider } = require('../utils/web3Provider');
const { encrypt } = require('../utils/cipherUtils');
const { addToIPFS } = require('../utils/ipfsUtils');
const tynABI = require('../../abi/ThankYouNote');

const provider = getWeb3Provider();
const coinbase = provider.addresses[0];
const wallet = provider.wallets[coinbase];

const tynContract = TruffleContract(tynABI);
tynContract.setProvider(provider);
tynContract.setNetwork(process.env.NETWORK_ID);

// https://github.com/trufflesuite/truffle-contract/issues/57
if (typeof tynContract.currentProvider.sendAsync !== 'function') {
  tynContract.currentProvider.sendAsync = () => {
    return tynContract.currentProvider.send.apply(
      tynContract.currentProvider, arguments
    );
  };
}

exports.thanks = async (domain, fromUser, toUser, message) => {
  const instance = await tynContract.deployed();
  const date = moment().unix();
  const encryptedMessage = encrypt(wallet._pubKey, message);
  const hash = await addToIPFS(encryptedMessage);
  const tx = await instance.thanks(date, domain, fromUser, toUser, hash, { from: coinbase });
  return tx;
};

exports.balanceOf = async (user) => {
  const instance = await tynContract.deployed();
  const balance = await instance.balanceOf(user);
  const sent = _.get(balance, '[0]', new BigNumber(0)).toNumber();
  const received = _.get(balance, '[1]', new BigNumber(0)).toNumber();
  return { sent, received };
};
