pragma solidity ^0.4.8;

import "./Constants.sol";

/// @title Condition based access control
/// @author DigixGlobal

contract ACConditions is Constants {
   
    modifier not_null_address(address _item) {
        if (_item == NULL_ADDRESS) {
            throw;
        } else {
            _;
        }
    }

    modifier if_null_address(address _item) {
        if (_item != NULL_ADDRESS) {
            throw;
        } else {
            _;
        }
    }

    modifier not_null_uint(uint256 _item) {
        if (_item == NONE) {
            throw;
        } else {
            _;
        }
    }

    modifier if_null_uint(uint256 _item) {
        if (_item != NONE) {
            throw;
        } else {
            _;
        }
    }

    modifier not_null_bytes(bytes32 _item) {
        if (_item == EMPTY) {
            throw;
        } else {
            _;
        }
    }

    modifier if_null_bytes(bytes32 _item) {
        if (_item != EMPTY) {
            throw;
        } else {
            _;
        }
    }

    modifier not_null_string(string _item) {
        bytes memory _i = bytes(_item);
        if (_i.length == 0) {
            throw;
        } else {
            _;
        }
    }

    modifier if_null_string(string _item) {
        bytes memory _i = bytes(_item);
        if (_i.length != 0) {
            throw;
        } else {
            _;
        }
    }

    modifier require_gas(uint256 _requiredgas) {
        if (msg.gas < _requiredgas) {
            throw;
        } else {
            _;
        }
    }

}
