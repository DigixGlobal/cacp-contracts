pragma solidity ^0.4.8;

/// @title Per user locking based access control
/// @author DigixGlobal

contract ACUserMutex {

    mapping (bytes32 => bool) user_mutex_locks;

    modifier if_user_mutex_locked(bytes32 _mutex_id) {
        if (!is_user_mutex_locked(_mutex_id)) {
            throw;
        } else {
            _;
        }
    }

    modifier unless_user_mutex_locked(bytes32 _mutex_id) {
        if (is_user_mutex_locked(_mutex_id)) {
            throw;
        } else {
            _;
        }
    }

    function lock_user_mutex(bytes32 _mutex_id) 
                             private 
                             returns (bool _success) 
    {
        bytes32 _key = sha3(msg.sender, _mutex_id);
        user_mutex_locks[_key] = true;
        _success = true;
        return _success;
    }
    
    function unlock_user_mutex(bytes32 _mutex_id) 
                               private 
                               returns (bool _success) 
    {
        bytes32 _key = sha3(msg.sender, _mutex_id);
        user_mutex_locks[_key] = true;
        _success = true;
        return _success;
    }
    
    function is_user_mutex_locked(bytes32 _mutex_id) 
                                  public 
                                  constant 
                                  returns (bool _locked) 
    {
        bytes32 _key = sha3(msg.sender, _mutex_id);
        _locked = user_mutex_locks[_key];
        return _locked;
    }

}
