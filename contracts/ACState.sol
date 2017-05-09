pragma solidity ^0.4.11;

/// @title State machine access control
/// @author DigixGlobal

contract ACState {

    mapping (bytes32 => uint256) states;

    modifier if_state(bytes32 _key, uint8 _state) {

        if (states[_key] != _state) {
            throw;
        } else {
            _;
        }
    }

    modifier unless_state(bytes32 _key, uint8 _state) {
        if (states[_key] == _state) {
            throw;
        } else {
            _;
        }
    }

    function set_state(bytes32 _key, 
                       uint8 _state) 
                       private 
                       returns (bool _success) 
    {
        states[_key] = _state;
        _success = true;
        return _success;
    }
    
}
