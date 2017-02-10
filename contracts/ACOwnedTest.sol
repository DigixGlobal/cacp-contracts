pragma solidity ^0.4.8;

import "./ACOwned.sol";

contract ACOwnedTest is ACOwned {

  function ACOwnedTest() {
    owner = msg.sender;
  }

  function test_if_owner() 
                        if_owner 
                        returns (bool _success) 
  {
    return true;
  }

}
