pragma solidity ^0.4.16;

/// @title Locking based access control
/// @author DigixGlobal
import '../ACSimpleMutex.sol';

contract MockACSimpleMutex is ACSimpleMutex {

  function set_mutex(bytes32 _mutex_id) {
    locks[_mutex_id] = true;
  }

  function get_mutex(bytes32 _mutex_id)
           returns (bool _result)
  {
    _result = locks[_mutex_id];
  }

  function test_if_simple_mutex_is_locked(bytes32 _mutex_id)
           if_simple_mutex_is_locked(_mutex_id)
           returns (bool _success)
  {
        _success = true;
  }

  function test_unless_simple_mutex_is_locked(bytes32 _mutex_id)
           unless_simple_mutex_is_locked(_mutex_id)
           returns (bool _success)
  {
    _success = true;
  }

  function test_lock_simple_mutex(bytes32 _mutex_id)
           returns (bool _success)
  {
    _success = lock_simple_mutex(_mutex_id);
  }

  function test_unlock_simple_mutex(bytes32 _mutex_id)
           returns (bool _success)
  {
    _success = unlock_simple_mutex(_mutex_id);
  }

}
