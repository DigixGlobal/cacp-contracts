const ACOwnedTest = artifacts.require('./ACOwnedTest.sol');
const ContractResolver = artifacts.require('./ContractResolver.sol');

module.exports = function(deployer, network, accounts) {
  deployer.deploy(ACOwnedTest);
  deployer.deploy(ContractResolver);
};
