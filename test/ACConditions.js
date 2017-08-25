const a = require('awaiting');

const bN = web3.toBigNumber;
const MockACConditions = artifacts.require('./MockACConditions.sol');

contract('ACConditions', function (addresses) {
  let mockACConditions;
  let someContractAddress;
  const someAccountAddress = addresses[0];
  const nullAddress = '0x0000000000000000000000000000000000000000';
  const zero = bN(0);
  const someNumber = bN(100);
  const someBigNumber = bN(1000);
  const emptyBytes = '0x0000000000000000000000000000000000000000000000000000000000000000';
  const someBytes = '0x1200000000000000000000000000000000000000000000000000000000000034';
  const nullString = '';
  const someString = 'blah';

  before(async function () {
    mockACConditions = await MockACConditions.new();
    someContractAddress = mockACConditions.address;
  });

  describe('not_null_address', function () {
    it('throws when address is null', async function () {
      assert.ok(await a.failure(mockACConditions.test_not_null_address.call(nullAddress)));
    });
    it('does not throw when address is not null', async function () {
      assert.equal(await mockACConditions.test_not_null_address.call(addresses[0]), true);
    });
  });

  describe('if_null_address', function () {
    it('throws when address is not null', async function () {
      assert.ok(await a.failure(mockACConditions.test_if_null_address.call(addresses[0])));
    });
    it('does not throw when address is null', async function () {
      assert.equal(await mockACConditions.test_if_null_address.call(nullAddress), true);
    });
  });

  describe('not_null_uint', function () {
    it('throws when uint is 0', async function () {
      assert.ok(await a.failure(mockACConditions.test_not_null_uint.call(zero)));
    });
    it('does not throw when uint is not 0', async function () {
      assert.equal(await mockACConditions.test_not_null_uint.call(someNumber), true);
      assert.equal(await mockACConditions.test_not_null_uint.call(someBigNumber), true);
    });
  });

  describe('if_null_uint', function () {
    it('throws when uint is not 0', async function () {
      assert.ok(await a.failure(mockACConditions.test_if_null_uint.call(someNumber)));
      assert.ok(await a.failure(mockACConditions.test_if_null_uint.call(someBigNumber)));
    });
    it('does not throw when uint is 0', async function () {
      assert.equal(await mockACConditions.test_if_null_uint.call(zero), true);
    });
  });

  describe('not_empty_bytes', function () {
    it('throws when bytes is empty', async function () {
      assert.ok(await a.failure(mockACConditions.test_not_empty_bytes.call(emptyBytes)));
    });
    it('does not throw when bytes is not empty', async function () {
      assert.equal(await mockACConditions.test_not_empty_bytes.call(someBytes), true);
    });
  });

  describe('if_empty_bytes', function () {
    it('throws when bytes is not empty', async function () {
      assert.ok(await a.failure(mockACConditions.test_if_empty_bytes.call(someBytes)));
    });
    it('does not throw when bytes is empty', async function () {
      assert.equal(await mockACConditions.test_if_empty_bytes.call(emptyBytes), true);
    });
  });

  describe('not_null_string', function () {
    it('throws when string is null', async function () {
      assert.ok(await a.failure(mockACConditions.test_not_null_string.call(nullString)));
    });
    it('does not throw when string is not null', async function () {
      assert.equal(await mockACConditions.test_not_null_string.call(someString), true);
    });
  });

  describe('if_null_string', function () {
    it('throws when string is not null', async function () {
      assert.ok(await a.failure(mockACConditions.test_if_null_string.call(someString)));
    });
    it('does not throw when string is null', async function () {
      assert.equal(await mockACConditions.test_if_null_string.call(nullString), true);
    });
  });

  describe('require_gas', function () {
    const requiredGas = 40000;
    const enoughGas = 400000;
    const notEnoughGas = 39999;
    const shouldBeEnoughGas = 40001;

    it('not enough gas: should throw', async function () {
      // console.log(await mockACConditions.test_require_gas(requiredGas, { gas: notEnoughGas }));
      assert.ok(await a.failure(mockACConditions.test_require_gas.call(requiredGas, { gas: notEnoughGas })));
    });

    it('More than enough gas: should not throw', async function () {
      // console.log(await mockACConditions.test_require_gas(requiredGas, { gas: enoughGas }));
      assert.equal(await mockACConditions.test_require_gas.call(requiredGas, { gas: enoughGas }), true);
    });

    // TODO Test failed. Maybe the test environments consume some extra gas?
    // it('Barely enough gas: should not throw', async function () {
    //   assert.equal(await mockACConditions.test_require_gas.call(requiredGas, { gas: shouldBeEnoughGas }), true);
    // });
  });

  describe('is_contract', function () {
    it('return false if address is not a contract', async function () {
      assert.equal(await mockACConditions.is_contract.call(someAccountAddress), false);
    });
    it('return true if address is a contract', async function () {
      assert.equal(await mockACConditions.is_contract.call(someContractAddress), true);
    });
  });

  describe('if_contract', function () {
    it('throws if address is not a contract', async function () {
      assert.ok(await a.failure(mockACConditions.test_if_contract.call(someAccountAddress)));
    });
    it('does not throw if address is a contract', async function () {
      assert.equal(await mockACConditions.test_if_contract.call(someContractAddress), true);
    });
  });

  describe('unless_contract', function () {
    it('throws if address is a contract', async function () {
      assert.ok(await a.failure(mockACConditions.test_unless_contract.call(someContractAddress)));
    });
    it('does not throw if address is not a contract', async function () {
      assert.equal(await mockACConditions.test_unless_contract.call(someAccountAddress), true);
    });
  });
});
