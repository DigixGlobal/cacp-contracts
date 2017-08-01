const ACOwnedTest = artifacts.require('./ACOwnedTest.sol');

module.exports = function(deployer, network, accounts) {
  deployer.deploy(ACOwnedTest);
};
