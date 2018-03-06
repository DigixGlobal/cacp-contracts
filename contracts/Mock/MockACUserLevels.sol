pragma solidity ^0.4.19;

import "../ACUserLevels.sol";

/// @title User levels based access control
/// @author DigixGlobal

contract MockACUserLevels is ACUserLevels {

  function get_is_ac_user_levels_init ()
           public
           constant
           returns (bool _is_ac_user_levels_init)
  {
    _is_ac_user_levels_init = is_ac_user_levels_init;
  }

  function mock_set_user_level (address _user, bytes32 _category, uint8 _level) public {
    user_levels[_category][_user] = _level;
  }

  function mock_set_is_ac_user_levels_init (bool _is_ac_user_levels_init) public {
    is_ac_user_levels_init = _is_ac_user_levels_init;
  }

  function test_init_ac_user_levels()
           public
           returns (bool _success)
  {
    _success = init_ac_user_levels();
  }

  function test_if_above_level(address _user, bytes32 _category, uint8 _required_level)
           if_above_level(_user, _category, _required_level)
           public
           constant
           returns (bool _success)
  {
    _success = true;
  }

  function test_if_below_level(address _user, bytes32 _category, uint8 _required_level)
           if_below_level(_user, _category, _required_level)
           public
           constant
           returns (bool _success)
  {
    _success = true;
  }


  function test_if_at_level(address _user, bytes32 _category, uint8 _required_level)
           if_at_level(_user, _category, _required_level)
           public
           constant
           returns (bool _success)
  {
    _success = true;
  }

  function test_unless_ac_user_levels_initialized ()
           unless_ac_user_levels_initialized ()
           public
           constant
           returns (bool _success)
  {
    _success = true;
  }
}
