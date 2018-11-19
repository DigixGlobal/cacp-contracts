const a = require('awaiting');

const MockContractResolver = artifacts.require('./MockContractResolver.sol');
const bN = web3.toBigNumber;

contract('ContractResolver', function (addresses) {
  let mockContractResolver;
  before(async function () {
    mockContractResolver = await MockContractResolver.new();
  });

  describe('ContractResolver()', function () {
    it('msg.sender is the owner', async function () {
      assert.deepEqual(await mockContractResolver.owner.call(), addresses[0]);
    });
    it('locked is false', async function () {
      assert.deepEqual(await mockContractResolver.mock_check_locked.call(), false);
    });
  });

  describe('unless_registered', function () {
    it('throw if contract key is already registered', async function () {
      await mockContractResolver.mock_register_contract(mockContractResolver.address, 'test1');
      assert.ok(await a.failure(mockContractResolver.test_unless_registered.call('test1')));
    });
    it('does not throw if key is not registered', async function () {
      assert.deepEqual(await mockContractResolver.test_unless_registered.call('test2'), true);
    });
  });

  describe('if_owner_origin', function () {
    it('throw if not from owner', async function () {
      assert.ok(await a.failure(mockContractResolver.test_if_owner_origin.call({ from: addresses[1] })));
    });
    it('does not throw if from owner', async function () {
      assert.deepEqual(await mockContractResolver.test_if_owner_origin.call(), true);
    });
  });

  // const now = function () {
  //   return Math.floor(Date.now() / 1000);
  // };

  describe('if_not_locked', function () {
    before(async function () {
      mockContractResolver = await MockContractResolver.new();
    });
    it('locked_forever == false, does not throw', async function () {
      assert.deepEqual(await mockContractResolver.test_if_not_locked.call(), true);
    });
    it('locked_forever == true, throws', async function () {
      await mockContractResolver.lock_resolver_forever();
      assert.ok(await a.failure(mockContractResolver.test_if_not_locked.call()));
    });
  });

  describe('init_register_contract', function () {
    before(async function () {
      mockContractResolver = await MockContractResolver.new();
    });
    it('register a zero address: revert', async function () {
      assert(await a.failure(mockContractResolver.init_register_contract.call('test1', '0x0', { from: addresses[0] })));
    });
    it('successfully register contract, return true', async function () {
      assert.deepEqual(await mockContractResolver.init_register_contract.call('test3', mockContractResolver.address, { from: addresses[0] }), true);
      await mockContractResolver.init_register_contract('test3', mockContractResolver.address);
      assert.deepEqual(await mockContractResolver.mock_check_contracts.call('test3'), mockContractResolver.address);
    });
    it('try to re-register same contract: revert', async function () {
      assert(await a.failure(mockContractResolver.init_register_contract.call('test3', mockContractResolver.address, { from: addresses[0] })));
    });
  });

  describe('lock_resolver_forever', function () {
    it('throws if msg.sender is not the owner', async function () {
      assert.ok(await a.failure(mockContractResolver.lock_resolver_forever.call({ from: addresses[1] })));
    });
    it('if msg.sender is the owner, set locked_forever = true, returns true', async function () {
      await mockContractResolver.mock_set_locked(false);
      assert.deepEqual(await mockContractResolver.lock_resolver_forever.call({ from: addresses[0] }), true);
      await mockContractResolver.lock_resolver_forever({ from: addresses[0] });
      assert.deepEqual(await mockContractResolver.mock_check_locked.call(), true);
    });
  });

  describe('get_contract', function () {
    it('throws if contract is not registered', async function () {
      assert.ok(await a.failure(mockContractResolver.get_contract.call('new_key')));
    });
    it('successfully get registered contract', async function () {
      await mockContractResolver.mock_register_contract(mockContractResolver.address, 'newly_created');
      assert.deepEqual(await mockContractResolver.get_contract.call('newly_created'), mockContractResolver.address);
    });
  });

  describe('claim_ownership', function () {
    before(async function () {
      assert.deepEqual(await mockContractResolver.change_owner.call(addresses[2]), true);
      await mockContractResolver.change_owner(addresses[2]);
    });
    it('[ownership claimed by somebody else]: throw', async function () {
      assert.ok(await a.failure(mockContractResolver.claim_ownership.call({ from: addresses[3] })));
    });
    it('[ownership claimed by new_owner]', async function () {
      assert.deepEqual(await mockContractResolver.claim_ownership.call({ from: addresses[2] }), true);
      await mockContractResolver.claim_ownership({ from: addresses[2] });
      assert.deepEqual(await mockContractResolver.test_if_owner_origin.call({ from: addresses[2] }), true);
      assert.ok(await a.failure(mockContractResolver.test_if_owner_origin.call()));
    });
  });
});
