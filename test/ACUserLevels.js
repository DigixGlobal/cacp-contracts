const a = require('awaiting');

const MockACUserLevels = artifacts.require('./MockACUserLevels.sol');
const bN = web3.toBigNumber;

contract('ACUserLevels', function (addresses) {
  let mockACUserLevels;
  before(async function () {
    mockACUserLevels = await MockACUserLevels.new();
    await mockACUserLevels.mock_set_user_level(addresses[0], 'test_category', bN(5));
  });

  describe('if_above_level[modifier]', function () {
    it('throws when user level is <= required level', async function () {
      assert.ok(await a.failure(mockACUserLevels.test_if_above_level.call(addresses[0], 'test_category', bN(5))));
      assert.ok(await a.failure(mockACUserLevels.test_if_above_level.call(addresses[0], 'test_category', bN(6))));
    });
    it('does not throw when user level is > required level', async function () {
      assert.deepEqual(await mockACUserLevels.test_if_above_level.call(addresses[0], 'test_category', bN(4)), true);
    });
  });

  describe('if_below_level[modifier]', function () {
    it('throws when user level is >= required level', async function () {
      assert.ok(await a.failure(mockACUserLevels.test_if_below_level.call(addresses[0], 'test_category', bN(5))));
      assert.ok(await a.failure(mockACUserLevels.test_if_below_level.call(addresses[0], 'test_category', bN(4))));
    });
    it('does not throw when user level is < required level', async function () {
      assert.deepEqual(await mockACUserLevels.test_if_below_level.call(addresses[0], 'test_category', bN(6)), true);
    });
  });

  describe('if_at_level[modifier]', function () {
    it('throws when user level != required level', async function () {
      assert.ok(await a.failure(mockACUserLevels.test_if_at_level.call(addresses[0], 'test_category', bN(6))));
      assert.ok(await a.failure(mockACUserLevels.test_if_at_level.call(addresses[0], 'test_category', bN(4))));
    });
    it('does not throw when user level == required level', async function () {
      assert.deepEqual(await mockACUserLevels.test_if_at_level.call(addresses[0], 'test_category', bN(5)), true);
    });
  });

  describe('unless_ac_user_levels_initialized[modifier]', function () {
    it('throws when is_ac_user_levels_init == true', async function () {
      await mockACUserLevels.mock_set_is_ac_user_levels_init(true);
      assert.ok(await a.failure(mockACUserLevels.test_unless_ac_user_levels_initialized.call()));
    });
    it('does not throw when is_ac_user_levels_init == false', async function () {
      await mockACUserLevels.mock_set_is_ac_user_levels_init(false);
      assert.deepEqual(await mockACUserLevels.test_unless_ac_user_levels_initialized.call(), true);
    });
  });

  describe('init_ac_user_levels', function () {
    it('returns true, set is_ac_user_levels_init = true', async function () {
      await mockACUserLevels.mock_set_is_ac_user_levels_init(false);
      assert.deepEqual(await mockACUserLevels.test_init_ac_user_levels.call(), true);
      await mockACUserLevels.test_init_ac_user_levels();
      assert.deepEqual(await mockACUserLevels.get_is_ac_user_levels_init.call(), true);
    });
    it('throws when is_ac_user_levels_init is true', async function () {
      assert.ok(await a.failure(mockACUserLevels.test_init_ac_user_levels.call()));
    });
    it('throws when is_ac_user_levels_init is true', async function () {
      assert.ok(await a.failure(mockACUserLevels.test_init_ac_user_levels.call()));
    });
  });

});
