const a = require('awaiting');

const MockACUserMutex = artifacts.require('./MockACUserMutex.sol');
const bN = web3.toBigNumber;

contract('ACUserMutex', function (addresses) {
  let mockACUserMutex;
  before(async function () {
    mockACUserMutex = await MockACUserMutex.new();
  });

  describe('if_user_mutex_locked[modifier]', function () {
    it('throws if user mutex is not locked', async function () {
      await mockACUserMutex.mock_setup_set_user_mutex(addresses[0], 'test', false);
      assert.ok(await a.failure(mockACUserMutex.test_if_user_mutex_locked.call('test', { from: addresses[0] })));
    });
    it('does not throw if user mutex is locked', async function () {
      await mockACUserMutex.mock_setup_set_user_mutex(addresses[0], 'test', true);
      assert.deepEqual(await mockACUserMutex.test_if_user_mutex_locked.call('test', { from: addresses[0] }), true);
    });
  });

  describe('unless_user_mutex_locked[modifier]', function () {
    it('throws if user mutex is locked', async function () {
      await mockACUserMutex.mock_setup_set_user_mutex(addresses[0], 'test', true);
      assert.ok(await a.failure(mockACUserMutex.test_unless_user_mutex_locked.call('test', { from: addresses[0] })));
    });
    it('does not throw if user mutex is unlocked', async function () {
      await mockACUserMutex.mock_setup_set_user_mutex(addresses[0], 'test', false);
      assert.deepEqual(await mockACUserMutex.test_unless_user_mutex_locked.call('test', { from: addresses[0] }), true);
    });
  });

  describe('lock_before_action[modifier]', function () {
    it('throws if user mutex is locked', async function () {
      await mockACUserMutex.mock_setup_set_user_mutex(addresses[0], 'test', true);
      assert.ok(await a.failure(mockACUserMutex.test_lock_before_action.call('test', { from: addresses[0] })));
    });
    it('if user mutex is unlocked, lock it', async function () {
      await mockACUserMutex.mock_setup_set_user_mutex(addresses[0], 'test', false);
      await mockACUserMutex.test_lock_before_action('test', { from: addresses[0] });
      assert.deepEqual(await mockACUserMutex.mock_get_user_mutex.call(addresses[0], 'test'), true);
    });
  });

  describe('unlock_after_action[modifier]', function () {
    it('throws if user mutex is unlocked', async function () {
      await mockACUserMutex.mock_setup_set_user_mutex(addresses[0], 'test', false);
      assert.ok(await a.failure(mockACUserMutex.test_unlock_after_action.call('test', { from: addresses[0] })));
    });
    it('if user mutex is locked, unlock it', async function () {
      await mockACUserMutex.mock_setup_set_user_mutex(addresses[0], 'test', true);
      await mockACUserMutex.test_unlock_after_action('test', { from: addresses[0] });
      assert.deepEqual(await mockACUserMutex.mock_get_user_mutex.call(addresses[0], 'test'), false);
    });
  });

  describe('lock_user_mutex[modifier]', function () {
    it('throws if user mutex is locked', async function () {
      await mockACUserMutex.mock_setup_set_user_mutex(addresses[0], 'test', true);
      assert.ok(await a.failure(mockACUserMutex.test_lock_user_mutex.call('test', { from: addresses[0] })));
    });
    it('if user mutex is unlocked, lock it', async function () {
      await mockACUserMutex.mock_setup_set_user_mutex(addresses[0], 'test', false);
      await mockACUserMutex.test_lock_before_action('test', { from: addresses[0] });
      assert.deepEqual(await mockACUserMutex.mock_get_user_mutex.call(addresses[0], 'test'), true);
    });
  });

  describe('unlock_user_mutex[modifier]', function () {
    it('throws if user mutex is unlocked', async function () {
      await mockACUserMutex.mock_setup_set_user_mutex(addresses[0], 'test', false);
      assert.ok(await a.failure(mockACUserMutex.test_unlock_user_mutex.call('test', { from: addresses[0] })));
    });
    it('if user mutex is locked, unlock it', async function () {
      await mockACUserMutex.mock_setup_set_user_mutex(addresses[0], 'test', true);
      await mockACUserMutex.test_unlock_user_mutex('test', { from: addresses[0] });
      assert.deepEqual(await mockACUserMutex.mock_get_user_mutex.call(addresses[0], 'test'), false);
    });
  });
});
