pragma solidity ^0.4.6;

import "../ACOwned.sol";

contract ACOwnedTest is ACOwned {

  function ACOwnedTest() {
    owner = msg.sender;
  }

  function testIfOwner() ifOwner() returns (bool _success) {
    return true;
  }

}
