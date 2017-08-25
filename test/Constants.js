const a = require('awaiting');

const bN = web3.toBigNumber;
const MockConstants = artifacts.require('./MockConstants.sol');

contract('Constants', function () {
  let mockConstants;
  before(async function () {
    mockConstants = await MockConstants.new();
  });

  describe('constants', function () {
    it('constants are correct', async function () {
      const result = await mockConstants.test_constants.call();
      assert.strictEqual(result[0], '0x0000000000000000000000000000000000000000');
      assert.deepEqual(result[1], bN(0));
      assert.strictEqual(result[2], '0x0000000000000000000000000000000000000000000000000000000000000000');
    });
  });
});
