/* globals DigixMath */
const Contest = require('@digix/contest').default;
const ACOwnedTest = artifacts.require('./ACOwnedTest.sol');

const {
  BIG_INT_MINUS_TWO,
  BIG_INT,
  ONE_DAY_IN_SECONDS,
  currentTimestamp,
  randomTime,
  randomInt,
} = require('@digix/contest/lib/helpers');

contract('ACOwnedTest', function (accounts) {
  new Contest()
  .artifact(ACOwnedTest)
  .describe('testIfOwner')
  .call('testIfOwner', 'returns true if called from the contract owner', [
    [[{from: accounts[0]}], [true]],
  ])
  .call('testIfOwner', 'throws if not called from the owner account', [
    [{from: accounts[1]}],
    [{from: accounts[2]}],
  ])
  .call('testIfOwner', 'does not throw if called from the owner account', [
    [{from: accounts[0]}],
  ]).done();
});
