const ContractResolver = artifacts.require('./ContractResolver.sol');
const MockResolverClient = artifacts.require('./MockResolverClient.sol');

module.exports = function (deployer, network, accounts) {
  deployer.deploy(ContractResolver).then(() => {
    return deployer.deploy(MockResolverClient, ContractResolver.address);
  })
};
