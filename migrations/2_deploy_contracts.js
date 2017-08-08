const ACOwnedTest = artifacts.require('./ACOwnedTest.sol');
const ContractResolver = artifacts.require('./ContractResolver.sol');
const ResolverClientTester = artifacts.require('./ResolverClientTester.sol');

module.exports = function(deployer, network, accounts) {
  deployer.deploy(ContractResolver).then(() => {
    deployer.deploy(ACOwnedTest);
    return deployer.deploy(ResolverClientTester, ContractResolver.address);
  })
};
