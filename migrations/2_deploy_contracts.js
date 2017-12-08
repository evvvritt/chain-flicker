var FlickerFilmContract = artifacts.require("./FlickerFilmContract.sol");
module.exports = function(deployer, helper, accounts) {
  return deployer.deploy(FlickerFilmContract)
}