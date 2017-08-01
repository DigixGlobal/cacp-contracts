pragma solidity ^0.4.13;

/// @title State machine access control
/// @author DigixGlobal

contract ACState {

  mapping (bytes32 => uint256) states;

  modifier if_state(bytes32 _key, uint8 _state) {
    require(states[_key] == _state);
    _;
  }

  modifier unless_state(bytes32 _key, uint8 _state) {
    require(states[_key] != _state);
    _;
  }

  modifier set_state_after(bytes32 _key, uint8 _state) {
    _;
    states[_key] = _state;
  }

  modifier increment_state_after(bytes32 _key) {
    _;
    states[_key]++;
  }

  modifier decrement_state_after(bytes32 _key) {
    _;
    states[_key]--;
  }

  modifier increment_state_before(bytes32 _key) {
    states[_key]++;
    _;
  }

  modifier decrement_state_before(bytes32 _key) {
    states[_key]--;
    _;
  }

  function set_state(bytes32 _key, uint8 _state) 
           internal 
           returns (bool _success) 
  {
    states[_key] = _state;
    _success = true;
  }
    
}
