const ecies = require('eth-ecies');

exports.encrypt = (publicKey, data) => {
  const bufferData = Buffer.from(data);

  const encryptedData = ecies.encrypt(publicKey, bufferData);

  return encryptedData.toString('base64');
};

exports.decrypt = (privateKey, encryptedData) => {
  try {
    const bufferEncryptedData = Buffer.from(encryptedData, 'base64');

    const decryptedData = ecies.decrypt(privateKey, bufferEncryptedData);

    return decryptedData.toString('utf8');
  } catch (error) {
    return undefined;
  }
};
