pragma solidity ^0.4.8;

import '../ACOwned.sol';

contract MockACOwned is ACOwned {

    function set_owner (address _owner) {
      owner = _owner;
    }

    function get_owner () returns (address _owner) {
      _owner = owner;
    }

    function get_is_ac_owned_init () returns (bool _is_ac_owned_init) {
      _is_ac_owned_init = is_ac_owned_init;
    }

    function test_if_owner () if_owner() returns (bool _success) {
      return true;
    }

    function test_init_ac_owned () returns (bool _success) {
      _success = init_ac_owned();
    }


}
