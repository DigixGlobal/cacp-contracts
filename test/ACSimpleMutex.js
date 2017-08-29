const a = require('awaiting');

const MockACSimpleMutex = artifacts.require('./MockACSimpleMutex.sol');

contract('ACSimpleMutex', function (addresses) {
  let mockACSimpleMutex;
  before(async function () {
    mockACSimpleMutex = await MockACSimpleMutex.new();
    await mockACSimpleMutex.set_mutex('test_mutex');
  });

  describe('if_simple_mutex_is_locked[modifier]', function () {
    it('throws when mutex is not locked', async function () {
      assert.ok(await a.failure(mockACSimpleMutex.test_if_simple_mutex_is_locked.call('test_another_mutex')));
    });
    it('does not throw when mutex is locked', async function () {
      assert.deepEqual(await mockACSimpleMutex.test_if_simple_mutex_is_locked.call('test_mutex'), true);
    });
  });

  describe('unless_simple_mutex_is_locked[modifier]', function () {
    it('throws when mutex is locked', async function () {
      assert.ok(await a.failure(mockACSimpleMutex.test_unless_simple_mutex_is_locked.call('test_mutex')));
    });
    it('does not throw when mutex is not locked', async function () {
      assert.deepEqual(await mockACSimpleMutex.test_unless_simple_mutex_is_locked.call('test_another_mutex'), true);
    });
  });

  describe('lock_simple_mutex', function () {
    it('returns true, mutex is locked', async function () {
      assert.deepEqual(await mockACSimpleMutex.test_lock_simple_mutex.call('test_another_mutex'), true);
      await mockACSimpleMutex.test_lock_simple_mutex('test_another_mutex');
      assert.deepEqual(await mockACSimpleMutex.get_mutex.call('test_another_mutex'), true);
    });
  });

  describe('unlock_simple_mutex', function () {
    it('returns true, mutex is unlocked', async function () {
      assert.deepEqual(await mockACSimpleMutex.test_unlock_simple_mutex.call('test_mutex'), true);
      await mockACSimpleMutex.test_unlock_simple_mutex('test_mutex');
      assert.deepEqual(await mockACSimpleMutex.get_mutex.call('test_mutex'), false);
    });
  });

  describe('is_simple_mutex_locked', function () {
    before(async function () {
      await mockACSimpleMutex.set_mutex('test_mutex');
    });
    it('returns true if mutex is locked', async function () {
      assert.deepEqual(await mockACSimpleMutex.is_simple_mutex_locked.call('test_mutex'), true);
    });
    it('returns false if mutex is unlocked', async function () {
      assert.deepEqual(await mockACSimpleMutex.is_simple_mutex_locked.call('new_mutex'), false);
    });
  });
});
