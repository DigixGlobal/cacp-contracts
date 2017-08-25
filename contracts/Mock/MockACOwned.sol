pragma solidity ^0.4.8;

import '../ACOwned.sol';

contract MockACOwned is ACOwned {

    function test_if_owner () if_owner() returns (bool _success) {
      return true;
    }

    function set_owner (address _owner) {
      owner = _owner;
    }

}
