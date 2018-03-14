const a = require('awaiting');

const MockContractResolver = artifacts.require('./MockContractResolver.sol');
const bN = web3.toBigNumber;

contract('ContractResolver', function (addresses) {
  let mockContractResolver;
  before(async function () {
    mockContractResolver = await MockContractResolver.new();
  });

  describe('ContractResolver()', function () {
    it('msg.sender is added to group "admins" and "nsadmins"', async function () {
      assert.deepEqual(await mockContractResolver.mock_check_group_member.call(addresses[0], 'admins'), true);
      assert.deepEqual(await mockContractResolver.mock_check_group_member.call(addresses[0], 'nsadmins'), true);

      // mockContractResolver.mock_setup_set_user_mutex(addresses[0], 'test', true);
      // assert.ok(await a.failure(mockContractResolver.test_lock_before_action.call('test', { from: addresses[0] })));
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

  const now = function () {
    return Math.floor(Date.now() / 1000);
  };

  describe('locked_after_period', function () {
    before(async function () {
      await mockContractResolver.mock_set_time_locked(true);
    });
    it('time_locked = true, throw if now > grace_period', async function () {
      const gracePeriodInThePast = bN(now() - 1);
      await mockContractResolver.mock_set_grace_period(gracePeriodInThePast);
      assert.ok(await a.failure(mockContractResolver.test_locked_after_period.call()));
    });
    it('time_locked = true, does not throw if now < grace_period', async function () {
      const gracePeriodInTheFuture = bN(now() + 1);
      await mockContractResolver.mock_set_grace_period(gracePeriodInTheFuture);
      assert.deepEqual(await mockContractResolver.test_locked_after_period.call(), true);
    });
    it('time_locked = true, does not throw if now == grace_period', async function () {
      const gracePeriodNow = bN(now());
      await mockContractResolver.mock_set_grace_period(gracePeriodNow);
      assert.deepEqual(await mockContractResolver.test_locked_after_period.call(), true);
    });
    it('time_locked = false, does not throw even if now > grace_period', async function () {
      await mockContractResolver.mock_set_time_locked(false);
      const gracePeriodInThePast = bN(now() - 100);
      await mockContractResolver.mock_set_grace_period(gracePeriodInThePast);
      assert.deepEqual(await mockContractResolver.test_locked_after_period.call(), true);
    });
  });

  describe('if_not_locked', function () {
    before(async function () {
      mockContractResolver = await MockContractResolver.new();
    });
    it('locked == true, throws', async function () {
      await mockContractResolver.lock_resolver();
      assert.ok(await a.failure(mockContractResolver.test_if_not_locked.call()));
    });
    it('locked == false, does not throw', async function () {
      await mockContractResolver.unlock_resolver();
      assert.deepEqual(await mockContractResolver.test_if_not_locked.call(), true);
    });
  });

  describe('init_register_contract', function () {
    it('successfully register contract, return true', async function () {
      await mockContractResolver.mock_set_time_locked(false);
      assert.deepEqual(await mockContractResolver.init_register_contract.call('test3', mockContractResolver.address, { from: addresses[0] }), true);
      await mockContractResolver.init_register_contract('test3', mockContractResolver.address);
      assert.deepEqual(await mockContractResolver.mock_check_contracts.call('test3'), mockContractResolver.address);
    });
  });

  describe('lock_resolver', function () {
    it('throws if msg.sender is not in nsadmins', async function () {
      assert.ok(await a.failure(mockContractResolver.lock_resolver.call({ from: addresses[1] })));
    });
    it('if msg.sender is in nsadmins, set locked = true, returns true', async function () {
      await mockContractResolver.mock_set_locked(false);
      assert.deepEqual(await mockContractResolver.lock_resolver.call({ from: addresses[0] }), true);
      await mockContractResolver.lock_resolver({ from: addresses[0] });
      assert.deepEqual(await mockContractResolver.mock_check_locked.call(), true);
    });
  });

  describe('unlock_resolver', function () {
    it('throws if msg.sender is not in nsadmins', async function () {
      assert.ok(await a.failure(mockContractResolver.unlock_resolver.call({ from: addresses[1] })));
    });
    it('if msg.sender is in nsadmins, set locked = false, returns true', async function () {
      await mockContractResolver.mock_set_locked(true);
      assert.deepEqual(await mockContractResolver.unlock_resolver.call({ from: addresses[0] }), true);
      await mockContractResolver.unlock_resolver({ from: addresses[0] });
      assert.deepEqual(await mockContractResolver.mock_check_locked.call(), false);
    });
  });

  describe('enable_time_locking', function () {
    it('throws if msg.sender is not owner', async function () {
      assert.ok(await a.failure(mockContractResolver.enable_time_locking.call(bN(100), { from: addresses[1] })));
    });
    it('if msg.sender is owner, set time_locked = true, returns true', async function () {
      await mockContractResolver.mock_set_time_locked(false);
      assert.deepEqual(await mockContractResolver.enable_time_locking.call(bN(100), { from: addresses[0] }), true);
      await mockContractResolver.enable_time_locking(bN(100), { from: addresses[0] });
      assert.deepEqual(await mockContractResolver.mock_check_time_locked.call(), true);
    });
    it('if msg.sender is owner, set grace_period correctly', async function () {
      await mockContractResolver.mock_set_time_locked(false);
      await mockContractResolver.enable_time_locking(bN(123), { from: addresses[0] });
      assert.deepEqual(await mockContractResolver.mock_get_grace_period.call(), bN(123));
    });
    it('[msg.sender is in nsadmins, but not owner]: throw', async function () {
      assert.deepEqual(await mockContractResolver.add_user_to_group.call('nsadmins', addresses[5]), true);
      await mockContractResolver.add_user_to_group('nsadmins', addresses[5]);
      assert.ok(await a.failure(mockContractResolver.enable_time_locking.call(bN(100), { from: addresses[5] })));
    });
  });

  describe('register_contract', function () {
    it('successfully register contract, return true', async function () {
      await mockContractResolver.mock_set_time_locked(false);
      assert.deepEqual(await mockContractResolver.register_contract.call('test4', mockContractResolver.address, { from: addresses[0] }), true);
      await mockContractResolver.register_contract('test4', mockContractResolver.address);
      assert.deepEqual(await mockContractResolver.mock_check_contracts.call('test4'), mockContractResolver.address);
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
      assert.deepEqual(await mockContractResolver.mock_check_group_member.call(addresses[0], 'nsadmins'), true);
      assert.deepEqual(await mockContractResolver.mock_check_group_member.call(addresses[2], 'nsadmins'), false);
    });
    it('[ownership claimed by new_owner]', async function () {
      assert.deepEqual(await mockContractResolver.claim_ownership.call({ from: addresses[2] }), true);
      await mockContractResolver.claim_ownership({ from: addresses[2] });
      assert.deepEqual(await mockContractResolver.test_if_owner_origin.call({ from: addresses[2] }), true);
      assert.ok(await a.failure(mockContractResolver.test_if_owner_origin.call()));
      assert.deepEqual(await mockContractResolver.mock_check_group_member.call(addresses[0], 'nsadmins'), false);
      assert.deepEqual(await mockContractResolver.mock_check_group_member.call(addresses[2], 'nsadmins'), true);
    });
  });
});
