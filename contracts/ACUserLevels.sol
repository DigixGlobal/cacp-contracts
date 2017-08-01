pragma solidity ^0.4.13;

import "./ACGroups.sol";

/// @title User levels based access control
/// @author DigixGlobal

contract ACUserLevels is ACGroups {

  bool is_ac_user_levels_init;
  mapping (bytes32 => mapping (address => uint8)) user_levels;

  modifier if_above_level(address _user, bytes32 _category, uint8 _required_level) {
    require(user_levels[_category][_user] > _required_level);
    _;
  }

  modifier if_below_level(address _user, bytes32 _category, uint8 _required_level) {
    require(user_levels[_category][_user] < _required_level);
    _;
  } 

  modifier if_at_level(address _user, bytes32 _category, uint8 _required_level) {
    require(user_levels[_category][_user] == _required_level);
    _;
  } 

  modifier unless_ac_user_levels_initialized() {
    require(is_ac_user_levels_init == false);
    _;
  }

  function init_ac_user_levels()
           unless_ac_user_levels_initialized()
           internal
           returns (bool _success)
  {
    is_ac_user_levels_init = true;
    require(init_ac_groups());
    require(add_user_to_group("uladmins", msg.sender));
    _success = true;
  }

}
