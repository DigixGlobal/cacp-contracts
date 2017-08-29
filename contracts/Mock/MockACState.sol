pragma solidity ^0.4.8;

import "../ACState.sol";

contract MockACState is ACState {

    function test_if_state(bytes32 _key, uint8 _state)
             if_state(_key, _state)
             returns (bool _success)
    {
      return true;
    }

    function test_unless_state(bytes32 _key, uint8 _state)
             unless_state(_key, _state)
             returns (bool _success)
    {
      return true;
    }

    function test_set_state_after(bytes32 _key, uint8 _state)
             set_state_after(_key, _state)
    {
      states[_key] = _state + 100; //something that is not _state
    }

    function test_increment_state_after(bytes32 _key)
             increment_state_after(_key)
    {
      states[_key] = 100; //fixed number
    }

    function test_decrement_state_after(bytes32 _key)
             decrement_state_after(_key)
    {
      states[_key] = 100; //fixed number
    }

    function test_increment_state_before_set_100(bytes32 _key)
             increment_state_before(_key)
    {
      states[_key] = 100; //set state = 100 in the function body
    }

    function test_increment_state_before_increment_100(bytes32 _key)
             increment_state_before(_key)
    {
      states[_key] += 100; //increment by 100 in the function body
    }


    function test_decrement_state_before_increment_100(bytes32 _key)
             decrement_state_before(_key)
    {
      states[_key] += 100; //always increment by 100 in the function body
    }

    function test_decrement_state_before_set_100(bytes32 _key)
             decrement_state_before(_key)
    {
      states[_key] = 100; //always increment by 100 in the function body
    }

    function test_set_state(bytes32 _key, uint8 _state)
             returns (bool _success)
    {
      _success = set_state(_key, _state);
    }

    function mock_setup_set_state(bytes32 _key, uint8 _state)
    {
      states[_key] = _state;
    }

    function get_state(bytes32 _key)
             returns (uint256 _state_value)
    {
      _state_value = states[_key];
    }
}
