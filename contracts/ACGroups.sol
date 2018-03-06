pragma solidity ^0.4.19;

import "./ACOwned.sol";

/// @title Owner based access control
/// @author DigixGlobal

contract ACGroups is ACOwned {

  bool is_ac_groups_init = false;

  struct Group {
    mapping(address => bool) members;
  }

  mapping (bytes32 => Group) groups;

  modifier if_group(bytes32 _group_name) {
    require(groups[_group_name].members[msg.sender]);
    _;
  }

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
           public
           returns (bool _success)
  {
    groups["admins"].members[_newadmin] = true;
    _success = true;
  }

  function unregister_admin(address _oldadmin)
           if_owner
           public
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
    require(_group != "admins");
    groups[_group].members[_user] = true;
    _success = true;
  }

  function delete_user_from_group(bytes32 _group, address _user)
           if_group("admins")
           public
           returns (bool _success)
  {
    require(_group != "admins");
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
