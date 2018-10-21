const ThankYouNoteToken = artifacts.require('ThankYouNoteToken');

module.exports = function (deployer) {
  deployer.deploy(ThankYouNoteToken, 'Thank You Note', 'TYN', 0);
};
