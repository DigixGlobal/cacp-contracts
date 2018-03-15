const a = require('awaiting');

const MockACGroups = artifacts.require('./MockACGroups.sol');

contract('ACGroups', function (addresses) {
  let mockACGroups;

  describe('if_group[modifier]', function () {
    before(async function () {
      mockACGroups = await MockACGroups.new();
      await mockACGroups.mock_add_user_to_group(addresses[0], 'test_group');
    });
    it('throws when sender is not in the group', async function () {
      assert.ok(await a.failure(mockACGroups.test_if_group.call('test_group', { from: addresses[1] })));
    });
    it('does not throw when sender is in the group', async function () {
      assert.deepEqual(await mockACGroups.test_if_group.call('test_group', { from: addresses[0] }), true);
    });
  });

  describe('init_ac_groups', function () {
    before(async function () {
      mockACGroups = await MockACGroups.new();
    });
    it('when called, set is_ac_groups_init=true, returns true', async function () {
      assert.deepEqual(await mockACGroups.test_init_ac_groups.call({ from: addresses[0] }), true);
      await mockACGroups.test_init_ac_groups({ from: addresses[0] });
      assert.deepEqual(await mockACGroups.get_is_ac_groups_init.call(), true);
    });
    it('when called, msg.sender is added to admins', async function () {
      mockACGroups = await MockACGroups.new();
      await mockACGroups.test_init_ac_groups({ from: addresses[0] });
      assert.deepEqual(await mockACGroups.assert_group_member.call(addresses[0], 'admins'), true);
    });
  });

  describe('register_admin(_newadmin)', function () {
    before(async function () {
      mockACGroups = await MockACGroups.new();
      await mockACGroups.set_owner(addresses[0]);
    });
    it('throws when not called by owner', async function () {
      assert.ok(await a.failure(mockACGroups.register_admin.call(addresses[0], { from: addresses[1] })));
    });
    it('called by the owner: _newadmin is added to group "admins", returns true', async function () {
      assert.deepEqual(await mockACGroups.register_admin.call(addresses[1], { from: addresses[0] }), true);
      await mockACGroups.register_admin(addresses[1], { from: addresses[0] });
      assert.deepEqual(await mockACGroups.assert_group_member.call(addresses[1], 'admins'), true);
    });
  });

  describe('unregister_admin(_oldadmin)', function () {
    before(async function () {
      mockACGroups = await MockACGroups.new();
      await mockACGroups.set_owner(addresses[0]);
      await mockACGroups.mock_add_user_to_group(addresses[1], 'admins');
    });
    it('throws when not called by owner', async function () {
      assert.ok(await a.failure(mockACGroups.unregister_admin.call(addresses[1], { from: addresses[1] })));
    });
    it('called by the owner: _oldadmin is removed from group "admins", returns true', async function () {
      assert.deepEqual(await mockACGroups.unregister_admin.call(addresses[1], { from: addresses[0] }), true);
      await mockACGroups.unregister_admin(addresses[1], { from: addresses[0] });
      assert.deepEqual(await mockACGroups.assert_group_member.call(addresses[1], 'admins'), false);
    });
  });

  describe('add_user_to_group(_group,_user)', function () {
    before(async function () {
      mockACGroups = await MockACGroups.new();
      await mockACGroups.set_owner(addresses[0]);
      await mockACGroups.mock_add_user_to_group(addresses[0], 'admins');
    });
    it('throws when not called by an admin', async function () {
      assert.ok(await a.failure(mockACGroups.add_user_to_group.call('test_group', addresses[1], { from: addresses[1] })));
    });
    it('called by an admin: _user is added to _group, returns true', async function () {
      assert.deepEqual(await mockACGroups.add_user_to_group.call('test_group', addresses[1], { from: addresses[0] }), true);
      await mockACGroups.add_user_to_group('test_group', addresses[1], { from: addresses[0] });
      assert.deepEqual(await mockACGroups.assert_group_member.call(addresses[1], 'test_group'), true);
    });
    it('[owner register another admin, that admin adds another user to admins group]: should fail', async function () {
      assert.deepEqual(await mockACGroups.register_admin.call(addresses[2], { from: addresses[0] }), true);
      await mockACGroups.register_admin(addresses[2], { from: addresses[0] });

      assert.deepEqual(await mockACGroups.is_group_member_of.call('admins', addresses[2]), true);
      assert.ok(await a.failure(mockACGroups.add_user_to_group.call('admins', addresses[1], { from: addresses[2] })));
    });
  });

  describe('delete_user_from_group(_group,_user)', function () {
    before(async function () {
      mockACGroups = await MockACGroups.new();
      await mockACGroups.set_owner(addresses[0]);
      await mockACGroups.mock_add_user_to_group(addresses[0], 'admins');
      await mockACGroups.mock_add_user_to_group(addresses[1], 'test_group');
    });
    it('throws when not called by an admin', async function () {
      assert.ok(await a.failure(mockACGroups.delete_user_from_group.call('test_group', addresses[1], { from: addresses[1] })));
    });
    it('called by an admin: _user is added to _group, returns true', async function () {
      assert.deepEqual(await mockACGroups.delete_user_from_group.call('test_group', addresses[1], { from: addresses[0] }), true);
      await mockACGroups.delete_user_from_group('test_group', addresses[1], { from: addresses[0] });
      assert.deepEqual(await mockACGroups.assert_group_member.call(addresses[1], 'test_group'), false);
    });
  });

  describe('is_group_member_of(_group,_user)', function () {
    before(async function () {
      mockACGroups = await MockACGroups.new();
      await mockACGroups.set_owner(addresses[0]);
      await mockACGroups.mock_add_user_to_group(addresses[0], 'admins');
      await mockACGroups.mock_add_user_to_group(addresses[1], 'test_group');
    });
    it('returns false when _user is not in _group', async function () {
      assert.deepEqual(await mockACGroups.is_group_member_of.call('admins', addresses[1], { from: addresses[0] }), false);
    });
    it('returns true when _user is in _group', async function () {
      assert.deepEqual(await mockACGroups.is_group_member_of.call('test_group', addresses[1], { from: addresses[0] }), true);
    });
  });

  describe('claim_ownership', function () {
    before(async function () {
      mockACGroups = await MockACGroups.new();
      await mockACGroups.mock_add_user_to_group(addresses[0], 'test_group');
      assert.deepEqual(await mockACGroups.test_init_ac_groups.call(), true);
      await mockACGroups.test_init_ac_groups();
      assert.deepEqual(await mockACGroups.test_if_owner.call(), true);
      await mockACGroups.change_owner(addresses[2]);
    });
    it('[ownership claimed by address who is not new_owner]: throw', async function () {
      assert.ok(await a.failure(mockACGroups.claim_ownership.call({ from: addresses[4] })));

      // new_owner should not be part of `admins` group
      // owner should still be a part of `admins` group
      assert.deepEqual(await mockACGroups.is_group_member_of.call('admins', addresses[0]), true);
      assert.deepEqual(await mockACGroups.is_group_member_of.call('admins', addresses[2]), false);
    });
    it('[ownership is claimed by new_owner]', async function () {
      assert.deepEqual(await mockACGroups.claim_ownership.call({ from: addresses[2] }), true);
      await mockACGroups.claim_ownership({ from: addresses[2] });

      assert.deepEqual(await mockACGroups.test_if_owner.call({ from: addresses[2] }), true);
      assert.deepEqual(await mockACGroups.is_group_member_of.call('admins', addresses[0]), false);
      assert.deepEqual(await mockACGroups.is_group_member_of.call('admins', addresses[2]), true);
    });
  });
});
