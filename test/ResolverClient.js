const a = require('awaiting');

const MockResolverClient = artifacts.require('./MockResolverClient.sol');
const MockContractResolver = artifacts.require('./MockContractResolver.sol');
const bN = web3.toBigNumber;

contract('ResolverClient', function (addresses) {
  let mockResolverClient;
  let mockContractResolver;
  before(async function () {
    mockResolverClient = await MockResolverClient.new();
    mockContractResolver = await MockContractResolver.new();
    await mockResolverClient.mock_set_resolver(mockContractResolver.address);
    await mockContractResolver.mock_register_contract(addresses[0], 'test_key');
  });

  describe('if_sender_is', function () {
    it('throw if sender is not correct', async function () {
      assert.ok(await a.failure(mockResolverClient.test_if_sender_is.call('random_key')));
    });
    it('does not throw if sender is registered correctly in the ContractResolver', async function () {
      assert.deepEqual(await mockResolverClient.test_if_sender_is.call('test_key'), true);
    });
  });

  describe('unless_resolver_is_locked', function () {
    it('throws if ContractResolver is locked', async function () {
      await mockContractResolver.mock_set_locked(true);
      assert.ok(await a.failure(mockResolverClient.test_unless_resolver_is_locked.call()));
    });
    it('does not throw if ContractResolver is unlocked', async function () {
      await mockContractResolver.mock_set_locked(false);
      assert.deepEqual(await mockResolverClient.test_unless_resolver_is_locked.call(), true);
    });
  });

  describe('get_contract', function () {
    it('returns correct contract address when key is valid', async function () {
      assert.deepEqual(await mockResolverClient.get_contract.call('test_key'), addresses[0]);
    });
    it('throws if key is not registered', async function () {
      assert.ok(await a.failure(mockResolverClient.get_contract.call('test_new_key')));
    });
  });

  describe('init', function () {
    it('if ContractResolver is locked, return false', async function () {
      await mockContractResolver.mock_set_locked(true);
      assert.deepEqual(await mockResolverClient.test_init.call('init_key', mockContractResolver.address), false);
    });
    it('if ContractResolver is unlocked, set CONTRACT_ADDRESS and resolver correctly, returns true', async function () {
      mockResolverClient = await MockResolverClient.new();
      await mockContractResolver.mock_set_locked(false);
      assert.deepEqual(await mockResolverClient.test_init.call('init_key', mockContractResolver.address), true);
      await mockResolverClient.test_init('init_key', mockContractResolver.address);
      assert.deepEqual(await mockResolverClient.resolver.call(), mockContractResolver.address);
      assert.deepEqual(await mockResolverClient.CONTRACT_ADDRESS.call(), mockResolverClient.address);
    });
    it('if ContractResolver is unlocked, set owner correctly, register contract correctly under provided key', async function () {
      mockResolverClient = await MockResolverClient.new();
      await mockContractResolver.mock_set_locked(false);
      await mockResolverClient.test_init('init_key_2', mockContractResolver.address);
      // assert.equal(1, 1);
      assert.deepEqual(await mockResolverClient.get_contract.call('init_key_2'), mockResolverClient.address);
    });
  });

  describe('destroy', function () {
    it('[change ownership, not yet claimed, new_owner try to destroy]: throw', async function () {
      assert.deepEqual(await mockContractResolver.change_owner.call(addresses[2]), true);
      await mockContractResolver.change_owner(addresses[2]);
      assert.ok(await a.failure(mockResolverClient.destroy.call({ from: addresses[2] })));
    });
    it('[claim ownership, destroy (previous owner cannot destroy)]: success', async function () {
      assert.deepEqual(await mockContractResolver.claim_ownership.call({ from: addresses[2] }), true);
      await mockContractResolver.claim_ownership({ from: addresses[2] });
      assert.ok(await a.failure(mockResolverClient.destroy()));
      assert.ok(await mockResolverClient.destroy({ from: addresses[2] }));
    });
  });
});
