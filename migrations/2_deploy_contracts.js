const ACOwnedTest = artifacts.require('./ACOwnedTest.sol');
const ContractResolver = artifacts.require('./ContractResolver.sol');
const MockResolverClient = artifacts.require('./MockResolverClient.sol');

module.exports = function(deployer, network, accounts) {
  deployer.deploy(ContractResolver).then(() => {
    deployer.deploy(ACOwnedTest);
    return deployer.deploy(MockResolverClient, ContractResolver.address);
  })
};
