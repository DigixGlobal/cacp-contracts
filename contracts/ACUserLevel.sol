pragma solidity ^0.4.11;

import "./ACGroups.sol";

/// @title User levels based access control
/// @author DigixGlobal

contract ACUserLevel is ACGroups {

    bool is_user_level_init;
    mapping (bytes32 => mapping (address => uint8)) user_levels;

    modifier if_above_level(address _user, bytes32 _category, uint8 _required_level) {
        if (user_levels[_category][_user] < _required_level) {
            throw;
        } else {
            _;
        }
    }

    modifier if_below_level(address _user, bytes32 _category, uint8 _rlevel) {
        if (user_levels[_category][_user] > _rlevel) {
            throw;
        } else {
            _;
        }
    }

    modifier if_at_level(address _user, bytes32 _category, uint8 _rlevel) {
        if (user_levels[_category][_user] != _rlevel) {
            throw;
        } else {
            _;
        }
    }

    modifier unless_user_level_initialized() {
        if (is_user_level_init) {
            throw;
        } else {
            _;
        }
    }

}
