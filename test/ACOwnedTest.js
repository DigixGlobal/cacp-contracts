/* globals DigixMath */
import Contest from '@digix/contest';
import Tempo from '@digix/tempo';
import { asyncIterator } from './helpers/async';
import { randomInt } from './helpers/random';
import { BIG_INT, BIG_INT_MINUS_TWO, ONE_DAY_IN_SECONDS } from './helpers/constants';

contract('ACOwnedTest', function (accounts) {
  let tempo;
  new Contest({ debug: true })
  .deployed('ACOwnedTest')
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
