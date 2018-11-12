pragma solidity ^0.4.25;

/// @title Blocktime based access control
/// @author DigixGlobal

contract ACDates {

  modifier if_before(uint256 _date) {
    require(now < _date);
    _;
  }

  modifier if_after(uint256 _date) {
    require(now > _date);
    _;
  }
}
