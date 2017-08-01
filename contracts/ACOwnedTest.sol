pragma solidity ^0.4.13;

import "./ACOwned.sol";

contract ACOwnedTest is ACOwned {

  function ACOwnedTest() {
    require(init_ac_owned());
  }

  function test_if_owner() 
           if_owner 
           returns (bool _success) 
  {
    return true;
  }

}
