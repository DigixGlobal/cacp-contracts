const a = require('awaiting');

const bN = web3.toBigNumber;
const MockACDates = artifacts.require('./MockACDates.sol');

contract('ACDates', function () {
  let mockACDates;
  before(async function () {
    mockACDates = await MockACDates.new();
  });
  const now = function () {
    return Math.floor(Date.now() / 1000);
  };
  describe('if_before(timestamp)', function () {
    it('throws when timestamp is in the past', async function () {
      const pastTimestamp = bN(now() - 1);
      assert.ok(await a.failure(mockACDates.test_if_before.call(pastTimestamp)));
    });
    it('does not throw when timestamp is in the future', async function () {
      const futureTimestamp = bN(now() + 1);
      assert.equal(await mockACDates.test_if_before.call(futureTimestamp), true);
    });
  });

  describe('if_after(timestamp)', function () {
    it('throws when timestamp is in the future', async function () {
      const futureTimestamp = bN(now() + 1);
      assert.ok(await a.failure(mockACDates.test_if_after.call(futureTimestamp)));
    });
    it('does not throw when timestamp is in the past', async function () {
      const pastTimestamp = bN(now() - 1);
      assert.equal(await mockACDates.test_if_after.call(pastTimestamp), true);
    });
  });
});
