pragma solidity ^0.4.25;

/// @title Per user locking based access control
/// @author DigixGlobal
import '../ACUserMutex.sol';

contract MockACUserMutex is ACUserMutex {

  function mock_setup_set_user_mutex (address _user, bytes32 _mutex_id, bool _value)
           public
  {
    user_mutexes[_user][_mutex_id] = _value;
  }

  function mock_get_user_mutex (address _user, bytes32 _mutex_id)
           public
           constant
           returns (bool _value)
  {
    _value = user_mutexes[_user][_mutex_id];
  }

  function test_if_user_mutex_locked (bytes32 _mutex_id)
           if_user_mutex_locked (_mutex_id)
           public
           constant
           returns (bool _success)
  {
    _success = true;
  }

  function test_unless_user_mutex_locked (bytes32 _mutex_id)
           unless_user_mutex_locked (_mutex_id)
           public
           constant
           returns (bool _success)
  {
    _success = true;
  }

  function test_lock_before_action (bytes32 _mutex_id)
           lock_before_action (_mutex_id)
           public
           returns (bool _success)
  {
    _success = true;
  }

  function test_unlock_after_action (bytes32 _mutex_id)
           unlock_after_action (_mutex_id)
           public
           returns (bool _success)
  {
    _success = true;
  }

  function test_lock_user_mutex (bytes32 _mutex_id)
           public
           returns (bool _success)
  {
    _success = lock_user_mutex(_mutex_id);
  }

  function test_unlock_user_mutex (bytes32 _mutex_id)
           public
           returns (bool _success)
  {
    _success = unlock_user_mutex(_mutex_id);
  }

}
