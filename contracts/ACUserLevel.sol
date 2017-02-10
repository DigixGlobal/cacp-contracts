pragma solidity ^0.4.8;

import "./ACGroups.sol";

/// @title User levels based access control
/// @author DigixGlobal

contract ACUserLevel is ACGroups {

    bool isUserLevelInit;
    mapping (bytes32 => mapping (address => uint8)) userLevels;

    modifier ifAboveLevel(address _user, bytes32 _category, uint8 _rlevel) {
        if (userLevels[_category][_user] < _rlevel) {
            throw;
        } else {
            _;
        }
    }

    modifier ifBelowLevel(address _user, bytes32 _category, uint8 _rlevel) {
        if (userLevels[_category][_user] > _rlevel) {
            throw;
        } else {
            _;
        }
    }

    modifier ifAtLevel(address _user, bytes32 _category, uint8 _rlevel) {
        if (userLevels[_category][_user] != _rlevel) {
            throw;
        } else {
            _;
        }
    }

    modifier unlessInitUserLevel() {
        if (isUserLevelInit) {
            throw;
        } else {
            _;
        }
    }

}
