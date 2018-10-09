var HDWalletProvider = require("truffle-hdwallet-provider");
var memonic = "banana adjust rich comfort virus clip taxi accident public erosion decorate start";


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    kovan: {
      provider: function(){
        return new HDWalletProvider(memonic, "https://kovan.infura.io/v3/da64c573fb534764bbe18716fe6fe421")
      },
      network_id: 42,
      gas:4500000,
      gasPrice: 21
    }  
  }
};
