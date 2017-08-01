pragma solidity ^0.4.13;

import "./ACOwned.sol";

/// @title Owner based access control
/// @author DigixGlobal

contract ACGroups is ACOwned {

  bool is_groups_init = false;

  struct Group {
    mapping(address => bool) members;
  }

  mapping (bytes32 => Group) groups;

  modifier if_group(bytes32 _group_name) {
    require(groups[_group_name].members[msg.sender]);
    _;
  }

  modifier unless_ac_groups_init() {
    require(is_groups_init == false);
    _;
  }

  function init_ac_groups()
           unless_ac_groups_init()
           internal
           returns (bool _success)
  {
    groups["admins"].members[msg.sender] = true;
    require(init_ac_groups());
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
