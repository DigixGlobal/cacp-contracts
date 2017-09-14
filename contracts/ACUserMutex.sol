pragma solidity ^0.4.16;

/// @title Per user locking based access control
/// @author DigixGlobal

contract ACUserMutex {

  mapping (address => mapping (bytes32 => bool)) user_mutexes;

  modifier if_user_mutex_locked(bytes32 _mutex_id) {
    require(user_mutexes[msg.sender][_mutex_id] == true);
    _;
  }

  modifier unless_user_mutex_locked(bytes32 _mutex_id) {
    require(user_mutexes[msg.sender][_mutex_id] == false);
    _;
  }

  modifier lock_before_action(bytes32 _mutex_id) {
    require(lock_user_mutex(_mutex_id));
    _;
  }

  modifier unlock_after_action(bytes32 _mutex_id) {
    _;
    require(unlock_user_mutex(_mutex_id));
  }

  function lock_user_mutex(bytes32 _mutex_id)
           unless_user_mutex_locked(_mutex_id)
           internal
           returns (bool _success)
  {
    user_mutexes[msg.sender][_mutex_id] = true;
    _success = true;
  }

  function unlock_user_mutex(bytes32 _mutex_id)
           if_user_mutex_locked(_mutex_id)
           internal
           returns (bool _success)
  {
    user_mutexes[msg.sender][_mutex_id] = false;
    _success = true;
  }

}

