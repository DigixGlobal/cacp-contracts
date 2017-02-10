pragma solidity ^0.4.8;

/// @title Blocktime based access control
/// @author DigixGlobal

contract ACDates {

    modifier ifBefore(uint256 _date) {
        if (now > _date) {
            throw;
        } else {
            _;
        }
    }

    modifier ifAfter(uint256 _date) {
        if (now < _date) {
            throw;
        } else {
            _;
        }
    }
}
