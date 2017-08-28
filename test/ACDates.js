const a = require('awaiting');

const bN = web3.toBigNumber;
const MockACDates = artifacts.require('./MockACDates.sol');

contract('ACDates', function () {
  let mockACDates;
  before(async function () {
    mockACDates = await MockACDates.new();
  });

  describe('if_before(timestamp)', function () {
    const now = Math.floor(Date.now() / 1000); // get timestamp in seconds
    const pastTimestamp = bN(now - 1);
    const futureTimestamp = bN(now + 1);

    it('throws when timestamp is in the past', async function () {
      assert.ok(await a.failure(mockACDates.test_if_before.call(pastTimestamp)));
    });
    it('does not throw when timestamp is in the future', async function () {
      assert.equal(await mockACDates.test_if_before.call(futureTimestamp), true);
    });
  });

  describe('if_after(timestamp)', function () {
    const now = Math.floor(Date.now() / 1000); // get timestamp in seconds
    const pastTimestamp = bN(now - 1);
    const futureTimestamp = bN(now + 1);

    it('throws when timestamp is in the future', async function () {
      assert.ok(await a.failure(mockACDates.test_if_after.call(futureTimestamp)));
    });
    it('does not throw when timestamp is in the past', async function () {
      assert.equal(await mockACDates.test_if_after.call(pastTimestamp), true);
    });
  });
});
