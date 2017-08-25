pragma solidity ^0.4.8;

import "../ACState.sol";

contract MockACState is ACState {

    /*
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
    */

    function test_if_state(bytes32 _key, uint8 _state)
                                    if_state(_key, _state)
                                    returns (bool _success)
    {
      return true;
    }

    /*function test_set_state(bytes32 _key,
                       uint8 _state)
                       returns (bool _success)
    {
        return set_state(_key, _state);
    }*/



}
