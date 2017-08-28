const a = require('awaiting');

const MockACState = artifacts.require('./MockACState.sol');
const bN = web3.toBigNumber;

contract('ACState', function (addresses) {
  let mockACState;
  before(async function () {
    mockACState = await MockACState.new();
  });

  describe('if_state[modifier]', function () {
    before(async function () {
      mockACState.mock_setup_set_state('test_key', 77);
    });
    it('throws if state value is not correct', async function () {
      assert.ok(await a.failure(mockACState.test_if_state.call('test_key', 76)));
    });
    it('does not throw if state value is correct', async function () {
      assert.deepEqual(await mockACState.test_if_state.call('test_key', 77), true);
    });
  });

  describe('unless_state[modifier]', function () {
    before(async function () {
      mockACState.mock_setup_set_state('test_key', 77);
    });
    it('throws if state value is correct', async function () {
      assert.ok(await a.failure(mockACState.test_unless_state.call('test_key', 77)));
    });
    it('does not throw if state value is not correct', async function () {
      assert.deepEqual(await mockACState.test_unless_state.call('test_key', 76), true);
    });
  });

  describe('set_state_after[modifier]', function () {
    const initialState = bN(77);
    const newState = bN(99);
    before(async function () {
      await mockACState.mock_setup_set_state('test_key', initialState);
    });
    it('the state should be set at the end of the function', async function () {
      await mockACState.test_set_state_after('test_key', newState);
      assert.deepEqual(await mockACState.get_state.call('test_key'), newState);
    });
  });

  describe('increment_state_after[modifier]', function () {
    const initialState = bN(77);
    const expectedNewState = bN(101); // the mockup's function body set state = 100,
    // then the modifier will add 1 => become 101;
    before(async function () {
      await mockACState.mock_setup_set_state('test_key', initialState);
    });
    it('the state should be incremented at the end of the function', async function () {
      await mockACState.test_increment_state_after('test_key');
      assert.deepEqual(await mockACState.get_state.call('test_key'), expectedNewState);
    });
  });

  describe('decrement_state_after[modifier]', function () {
    const initialState = bN(77);
    const expectedNewState = bN(99); // the mockup's function body set the state = 100,
    // then the modifier will decrement it to 99;
    before(async function () {
      await mockACState.mock_setup_set_state('test_key', initialState);
    });
    it('the state should be decremented at the end of the function', async function () {
      await mockACState.test_decrement_state_after('test_key');
      assert.deepEqual(await mockACState.get_state.call('test_key'), expectedNewState);
    });
  });

  describe('increment_state_before[modifier]', function () {
    const initialState = bN(77);
    before(async function () {
      await mockACState.mock_setup_set_state('test_key', initialState);
    });
    it('the state will be incremented', async function () {
      await mockACState.test_increment_state_before_increment_100('test_key');
      assert.deepEqual(await mockACState.get_state.call('test_key'), bN(178));
      // explanation: modifier increment by 1, function body increment by 100
    });
    it('if the function body overwrites the state, it is not incremented', async function () {
      await mockACState.mock_setup_set_state('test_key', initialState);
      await mockACState.test_increment_state_before_set_100('test_key');
      assert.deepEqual(await mockACState.get_state.call('test_key'), bN(100));
      // explanation: modifier increment by 1, but function body overwrites state=100
    });
  });

  describe('decrement_state_before[modifier]', function () {
    const initialState = bN(77);
    before(async function () {
      await mockACState.mock_setup_set_state('test_key', initialState);
    });
    it('the state will be decremented', async function () {
      await mockACState.test_decrement_state_before_increment_100('test_key');
      assert.deepEqual(await mockACState.get_state.call('test_key'), bN(176));
      // explanation: modifier decrement by 1, function body increment by 100
    });
    it('if the function body overwrites the state, it is not decremented', async function () {
      await mockACState.mock_setup_set_state('test_key', initialState);
      await mockACState.test_decrement_state_before_set_100('test_key');
      assert.deepEqual(await mockACState.get_state.call('test_key'), bN(100));
      // explanation: modifier decrement by 1, but function body overwrites state=100
    });
  });

  describe('set_state', function () {
    it('returns true and set the state correctly', async function () {
      assert.deepEqual(await mockACState.test_set_state.call('new_key', bN(13)), true);
      await mockACState.test_set_state('new_key', bN(13));
      assert.deepEqual(await mockACState.get_state.call('new_key'), bN(13));
    });
  });
});
