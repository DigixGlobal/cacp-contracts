pragma solidity ^0.4.19;

/// @title Locking based access control
/// @author DigixGlobal

contract ACSimpleMutex {

  mapping (bytes32 => bool) locks;

  modifier if_simple_mutex_is_locked(bytes32 _mutex_id) {
    require(is_simple_mutex_locked(_mutex_id) == true);
    _;
  }

  modifier unless_simple_mutex_is_locked(bytes32 _mutex_id) {
    require(is_simple_mutex_locked(_mutex_id) == false);
    _;
  }

  function lock_simple_mutex(bytes32 _mutex_id)
           internal
           returns (bool _success)
  {
    locks[_mutex_id] = true;
    _success = true;
  }

  function unlock_simple_mutex(bytes32 _mutex_id)
           internal
           returns (bool _success)
  {
    locks[_mutex_id] = false;
    _success = true;
  }

  function is_simple_mutex_locked(bytes32 _mutex_id)
           public
           constant
           returns (bool _locked)
  {
    _locked = locks[_mutex_id];
  }

}
