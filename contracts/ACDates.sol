pragma solidity ^0.4.11;

/// @title Blocktime based access control
/// @author DigixGlobal

contract ACDates {

    modifier if_before(uint256 _date) {
        if (now > _date) {
            throw;
        } else {
            _;
        }
    }

    modifier if_after(uint256 _date) {
        if (now < _date) {
            throw;
        } else {
            _;
        }
    }
}
