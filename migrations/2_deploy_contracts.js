module.exports = function(deployer) {
  deployer.deploy(User);
  deployer.deploy(Asset);
	deployer.deploy(GoldTokensStorage);
};
