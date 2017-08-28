pragma solidity ^0.4.14;

/// @title Blocktime based access control
/// @author DigixGlobal
import '../ACDates.sol';

contract MockACDates is ACDates {

  function test_if_before(uint256 _date) if_before(_date) returns (bool _success) {

    return true;
  }

  function test_if_after(uint256 _date) if_after(_date) returns (bool _success) {
    return true;
  }

  function get_now() returns (uint256 _now) {
    return _now;
  }

  /*modifier if_before(uint256 _date) {
    require(now < _date);
    _;
  }

  modifier if_after(uint256 _date) {
    require(now > _date);
    _;
  }*/
}
