const a = require('awaiting');

const MockACOwned = artifacts.require('./MockACOwned.sol');

contract('ACOwned', function (addresses) {
  let mockAcOwned;
  before(async function () {
    mockAcOwned = await MockACOwned.new();
  });

  describe('if_owner[modifier]', function () {
    before(async function () {
      await mockAcOwned.set_owner(addresses[0]);
    });
    it('does not throw when sender is the owner', async function () {
      assert.deepEqual(await mockAcOwned.test_if_owner.call({ from: addresses[0] }), true);
    });
    it('throws when sender is not the owner', async function () {
      assert.ok(await a.failure(mockAcOwned.test_if_owner.call({ from: addresses[1] })));
    });
  });

  describe('is_owner', function () {
    before(async function () {
      await mockAcOwned.set_owner(addresses[0]);
    });
    it('returns true when sender is the owner', async function () {
      assert.deepEqual(await mockAcOwned.is_owner.call({ from: addresses[0] }), true);
    });
    it('returns false when sender is not the owner', async function () {
      assert.deepEqual(await mockAcOwned.is_owner.call({ from: addresses[1] }), false);
    });
  });

  describe('init_ac_owned', function () {
    before(async function () {
      mockAcOwned = await MockACOwned.new();
    });
    it('when called, set owner correctly, set is_ac_owned_init=true and returns true', async function () {
      assert.deepEqual(await mockAcOwned.test_init_ac_owned.call({ from: addresses[0] }), true);
      await mockAcOwned.test_init_ac_owned({ from: addresses[0] });
      assert.deepEqual(await mockAcOwned.get_is_ac_owned_init.call(), true);
      assert.deepEqual(await mockAcOwned.get_owner.call(), addresses[0]);
    });
  });

  describe('change_owner', function () {
    before(async function () {
      mockAcOwned = await MockACOwned.new();
      await mockAcOwned.set_owner(addresses[0]);
    });
    it('when called by current owner, successfully set new_owner, returns true', async function () {
      assert.deepEqual(await mockAcOwned.change_owner.call(addresses[1], { from: addresses[0] }), true);
      await mockAcOwned.change_owner(addresses[1], { from: addresses[0] });
      assert.deepEqual(await mockAcOwned.new_owner.call(), addresses[1]);
    });
    it('throw when not called by current owner', async function () {
      await mockAcOwned.set_owner(addresses[0]);
      assert.ok(await a.failure(mockAcOwned.change_owner.call(addresses[0], { from: addresses[1] })));
    });
  });

  describe('claim_ownership', function () {
    beforeEach(async function () {
      mockAcOwned = await MockACOwned.new();
      await mockAcOwned.set_owner(addresses[0]);
      await mockAcOwned.change_owner(addresses[1]); // the new owner is set to be addresses[1]
    });
    it('when called by new owner, successfully set owner = new_owner, returns true', async function () {
      assert.deepEqual(await mockAcOwned.claim_ownership.call({ from: addresses[1] }), true);
      await mockAcOwned.claim_ownership({ from: addresses[1] });
      assert.deepEqual(await mockAcOwned.owner.call(), addresses[1]);
    });
    it('throw when not called by new owner', async function () {
      assert.ok(await a.failure(mockAcOwned.claim_ownership.call({ from: addresses[0] })));
    });
  });
});
