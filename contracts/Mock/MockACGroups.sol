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
}
