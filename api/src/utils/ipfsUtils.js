const IPFS = require('ipfs-api');
const _ = require('lodash');

const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

exports.addToIPFS = async (data) => {
  const content = ipfs.types.Buffer.from(data);
  const results = await ipfs.files.add(content);
  return _.get(results, '[0].hash', '');
};

exports.getFromIPFS = async (cid) => {
  try {
    const results = await ipfs.files.get(cid);
    return _.get(results, '[0].content', '');
  } catch (error) {
    console.error(error);
    return false;
  }
};
