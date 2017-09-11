pragma solidity ^0.4.16;

import "../ACUserLevels.sol";

/// @title User levels based access control
/// @author DigixGlobal

contract MockACUserLevels is ACUserLevels {

  function get_is_ac_user_levels_init ()
           returns (bool _is_ac_user_levels_init)
  {
    _is_ac_user_levels_init = is_ac_user_levels_init;
  }

  function mock_set_user_level (address _user, bytes32 _category, uint8 _level) {
    user_levels[_category][_user] = _level;
  }

  function mock_set_is_ac_user_levels_init (bool _is_ac_user_levels_init){
    is_ac_user_levels_init = _is_ac_user_levels_init;
  }

  function test_init_ac_user_levels()
           returns (bool _success)
  {
    _success = init_ac_user_levels();
  }

  function test_if_above_level(address _user, bytes32 _category, uint8 _required_level)
           if_above_level(_user, _category, _required_level)
           returns (bool _success)
  {
    _success = true;
  }

  function test_if_below_level(address _user, bytes32 _category, uint8 _required_level)
           if_below_level(_user, _category, _required_level)
           returns (bool _success)
  {
    _success = true;
  }


  function test_if_at_level(address _user, bytes32 _category, uint8 _required_level)
           if_at_level(_user, _category, _required_level)
           returns (bool _success)
  {
    _success = true;
  }

  function test_unless_ac_user_levels_initialized ()
           unless_ac_user_levels_initialized ()
           returns (bool _success)
  {
    _success = true;
  }

  /*bool is_ac_user_levels_init;
  mapping (bytes32 => mapping (address => uint8)) user_levels;

  modifier if_above_level(address _user, bytes32 _category, uint8 _required_level) {
    require(user_levels[_category][_user] > _required_level);
    _;
  }*/

  /*modifier if_below_level(address _user, bytes32 _category, uint8 _required_level) {
    require(user_levels[_category][_user] < _required_level);
    _;
  }

  modifier if_at_level(address _user, bytes32 _category, uint8 _required_level) {
    require(user_levels[_category][_user] == _required_level);
    _;
  }*/

  /*modifier unless_ac_user_levels_initialized() {
    require(is_ac_user_levels_init == false);
    _;
  }*/

  /*function init_ac_user_levels()
           unless_ac_user_levels_initialized()
           internal
           returns (bool _success)
  {
    is_ac_user_levels_init = true;
    require(init_ac_groups());
    require(add_user_to_group("uladmins", msg.sender));
    _success = true;
  }*/

}
