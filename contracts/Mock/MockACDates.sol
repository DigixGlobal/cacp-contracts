pragma solidity ^0.4.25;

/// @title Blocktime based access control
/// @author DigixGlobal
import '../ACDates.sol';

contract MockACDates is ACDates {

  function test_if_before(uint256 _date) if_before(_date) public constant returns (bool _success) {

    return true;
  }

  function test_if_after(uint256 _date) if_after(_date) public constant returns (bool _success) {
    return true;
  }
}
