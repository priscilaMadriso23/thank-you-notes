const ThankYouNote = artifacts.require('ThankYouNote');
const ThankYouNoteToken = artifacts.require('ThankYouNoteToken');

module.exports = function (deployer) {
  // in production networks we should use the same token smart contract
  deployer.deploy(ThankYouNoteToken, 'Thank You Note', 'TYN', 2)
    .then(() => {
      return deployer.deploy(ThankYouNote, ThankYouNoteToken.address, 2);
    })
    .then(() => {
      return ThankYouNoteToken.deployed();
    })
    .then((token) => {
      token.addMinter(ThankYouNote.address);
    })
};
