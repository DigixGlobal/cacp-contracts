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
    await mockContractResolver.mock_register_contract(addresses[1], 'test_key_one_more');
    await mockContractResolver.mock_register_contract(addresses[2], 'test_key_another');
  });

  describe('if_sender_is', function () {
    it('throw if sender is not correct', async function () {
      assert.ok(await a.failure(mockResolverClient.test_if_sender_is.call('random_key')));
    });
    it('does not throw if sender is registered correctly in the ContractResolver', async function () {
      assert.deepEqual(await mockResolverClient.test_if_sender_is.call('test_key'), true);
    });
  });

  describe('if_sender_is_from', function () {
    it('throw if not from any', async function () {
      assert(await a.failure(mockResolverClient.test_if_sender_is_from.call(['random_key', 'another_random_key'])));
    });
    it('success if any one of them', async function () {
      assert.deepEqual(await mockResolverClient.test_if_sender_is_from.call(['test_key_one_more', 'test_key'], { from: addresses[0] }), true);
      assert.deepEqual(await mockResolverClient.test_if_sender_is_from.call(['test_key_one_more', 'test_key'], { from: addresses[1] }), true);
      assert.deepEqual(await mockResolverClient.test_if_sender_is_from.call(['test_key_one_more', 'test_key_another'], { from: addresses[2] }), true);
      assert.deepEqual(await mockResolverClient.test_if_sender_is_from.call(['test_key', 'test_key_another'], { from: addresses[2] }), true);
      assert(await a.failure(mockResolverClient.test_if_sender_is_from.call(['test_key_one_more', 'test_key'], { from: addresses[2] })));
      assert(await a.failure(mockResolverClient.test_if_sender_is_from.call(['test_key_another', 'test_key'], { from: addresses[1] })));
      assert(await a.failure(mockResolverClient.test_if_sender_is_from.call(['test_key_another', 'test_key_one_more'], { from: addresses[0] })));
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
});
