const a = require('awaiting');

const MockACOwned = artifacts.require('./MockACOwned.sol');

contract('ACOwned', function (addresses) {
  let mockAcOwned;
  before(async function () {
    mockAcOwned = await MockACOwned.new();
  });

  describe('if_owner', function () {
    before(async function () {
      await mockAcOwned.set_owner(addresses[0]);
    });
    it('does not throw when sender is the owner', async function () {
      assert.equal(await mockAcOwned.test_if_owner.call({ from: addresses[0] }), true);
    });
    it('throws when sender is not the owner', async function () {
      assert.ok(await a.failure(mockAcOwned.test_if_owner.call({ from: addresses[1] })));
    });
  });
});
