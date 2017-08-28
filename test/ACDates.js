const a = require('awaiting');

const bN = web3.toBigNumber;
const MockACDates = artifacts.require('./MockACDates.sol');

contract('ACDates', function () {
  let mockACDates;
  before(async function () {
    mockACDates = await MockACDates.new();
  });

  describe('if_before', function () {
    const now = Date.now() / 1000000;
    const pastTimestamp = bN(now - 1);
    const futureTimestamp = bN(now + 10);
    before(async function () {
      console.log(await mockACDates.get_now.call());
    });

    it('throws when timestamp is in the future', async function () {
      assert.ok(await a.failure(mockACDates.test_if_before.call(futureTimestamp)));
    });
    // it('does not throw when timestamp is in the past', async function () {
    //   assert.equal(await mockACDates.test_if_before.call(pastTimestamp), true);
    // });
  });
});
