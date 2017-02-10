const ACOwnedTest = artifacts.require('./ACOwnedTest.sol');


module.exports = function(deployer) {
  deployer.deploy(ACOwnedTest);
};
