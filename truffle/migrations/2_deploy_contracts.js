var ThankYouNoteToken = artifacts.require("ThankYouNoteToken");

module.exports = function(deployer) {
  deployer.deploy(ThankYouNoteToken);
};