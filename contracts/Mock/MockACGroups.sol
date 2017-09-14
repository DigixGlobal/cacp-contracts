pragma solidity ^0.4.16;

import "../ACGroups.sol";

/// @title Owner based access control
/// @author DigixGlobal

contract MockACGroups is ACGroups {

  function set_owner (address _owner) {
    owner = _owner;
  }

  function get_owner () returns (address _owner) {
    _owner = owner;
  }
  
  function test_if_group(bytes32 _group_name) if_group(_group_name) returns (bool _success) {
    _success = true;
  }

  function test_init_ac_groups() returns (bool _success){
    _success = init_ac_groups();
  }

  function mock_add_user_to_group(address _user, bytes32 _group_name) {
    groups[_group_name].members[_user] = true;
  }

  function get_is_ac_groups_init() returns (bool _is_ac_groups_init) {
    _is_ac_groups_init = is_ac_owned_init;
  }

  function assert_group_member(address _user, bytes32 _group_name) returns (bool _success) {
    _success = groups[_group_name].members[_user];
  }
  /*bool is_ac_groups_init = false;

  struct Group {
    mapping(address => bool) members;
  }

  mapping (bytes32 => Group) groups;

  modifier if_group(bytes32 _group_name) {
    require(groups[_group_name].members[msg.sender]);
    _;
  }*/

  function init_ac_groups()
           internal
           returns (bool _success)
  {
    if(is_ac_owned_init == false) {
      init_ac_owned();
    }
    if(is_ac_groups_init == false) {
      groups["admins"].members[msg.sender] = true;
      is_ac_groups_init = true;
    }
    _success = true;
  }

  function register_admin(address _newadmin)
           if_owner
           returns (bool _success)
  {
    groups["admins"].members[_newadmin] = true;
    _success = true;
  }

  function unregister_admin(address _oldadmin)
           if_owner
           returns (bool _success)
  {
    groups["admins"].members[_oldadmin] = false;
    _success = true;
  }

  function add_user_to_group(bytes32 _group, address _user)
           if_group("admins")
           public
           returns (bool _success)
  {
    groups[_group].members[_user] = true;
    _success = true;
  }

  function delete_user_from_group(bytes32 _group, address _user)
           if_group("admins")
           public
           returns (bool _success)
  {
    groups[_group].members[_user] = false;
    _success = true;
  }

  function is_group_member_of(bytes32 _group, address _user)
           public
           constant
           returns (bool _ismember)
  {
    _ismember = groups[_group].members[_user];
  }

}
