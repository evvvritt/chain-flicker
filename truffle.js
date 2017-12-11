var HDWalletProvider = require("truffle-hdwallet-provider");
var secrets = require('./secret.js')

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(secrets.mnemonic, "https://rinkeby.infura.io/" + secrets.infura)
      },
      network_id: 4
    },
    kovan: {
      provider: function() {
        // let pro = new HDWalletProvider(secrets.mnemonicKovan, "https://kovan.infura.io/" + secrets.infura, 0)
        // console.log(secrets.mnemonicKovan)
        // console.log(pro.address)
        // return pro
        return new HDWalletProvider(secrets.mnemonicKovan, "https://kovan.infura.io/jwmDqmL5w80apHTX8VWY", 0)
      },
      network_id: 42,
      gas: 4700000
    } 
  }
}
