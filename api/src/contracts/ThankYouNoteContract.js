const TruffleContract = require('truffle-contract');
const moment = require('moment');
const _ = require('lodash');
const BigNumber = require('bignumber.js');
const { getWeb3Provider } = require('../utils/web3Provider');
const { encrypt, decrypt } = require('../utils/cipherUtils');
const { addToIPFS, getFromIPFS } = require('../utils/ipfsUtils');
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
  let decimals = await instance.decimals();
  decimals = decimals.toNumber();
  const qty = (1 * (10 ** decimals));
  const tx = await instance.thanks(date, domain, fromUser, toUser, hash, qty, { from: coinbase });
  return tx;
};

exports.balanceOf = async (user) => {
  const instance = await tynContract.deployed();
  const balance = await instance.balanceOf(user);
  let decimals = await instance.decimals();
  decimals = decimals.toNumber();
  let sent = _.get(balance, '[0]', new BigNumber(0)).toNumber();
  let received = _.get(balance, '[1]', new BigNumber(0)).toNumber();
  sent = _.round((sent / (10 ** decimals)), decimals);
  received = _.round((received / (10 ** decimals)), decimals);
  return { sent, received };
};

exports.getThanksHistory = async () => {
  const instance = await tynContract.deployed();
  let decimals = await instance.decimals();
  decimals = decimals.toNumber();
  return new Promise((resolve, reject) => {
    instance.Thanks({}, { fromBlock: 0 }).get((error, event) => {
      if (!error) {
        const thanksEvents = _.map(event, async (e) => {
          const args = _.get(e, 'args', {});
          const messageHash = _.get(args, 'messageHash', '');
          const from = _.get(args, 'from', '');
          const to = _.get(args, 'to', '');
          const domain = _.get(args, 'domain', '');
          const tempDate = _.get(args, 'date', '');
          const tempQty = _.get(args, 'qty', new BigNumber(0)).toNumber();
          const qty = _.round((tempQty / (10 ** decimals)), decimals);
          const date = moment.unix(tempDate).utc();
          // const encryptedMessage = await getFromIPFS(messageHash);
          // let message;
          // if (encryptedMessage) {
          //   message = decrypt(wallet._privKey, encryptedMessage.toString());
          // }
          return { from, to, messageHash, domain, date, qty };
        });
        resolve(Promise.all(thanksEvents));
      } else {
        reject(error);
      }
    });
  });
};
