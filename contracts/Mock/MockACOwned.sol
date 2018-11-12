pragma solidity ^0.4.25;

import '../ACOwned.sol';

contract MockACOwned is ACOwned {

    function set_owner (address _owner) public {
      owner = _owner;
    }

    function get_owner () public constant returns (address _owner) {
      _owner = owner;
    }

    function get_is_ac_owned_init () public constant returns (bool _is_ac_owned_init) {
      _is_ac_owned_init = is_ac_owned_init;
    }

    function test_if_owner () if_owner() public constant returns (bool _success) {
      return true;
    }

    function test_init_ac_owned () public returns (bool _success) {
      _success = init_ac_owned();
    }


}
