var HDWalletProvider = require("truffle-hdwallet-provider");
var secret = require('./secret.js')

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(secret.mnemonic, "https://rinkeby.infura.io/jwmDqmL5w80apHTX8VWY ")
      },
      network_id: 4
    }   
  }
};
