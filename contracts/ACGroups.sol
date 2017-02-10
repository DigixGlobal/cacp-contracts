pragma solidity ^0.4.8;

import "./ACOwned.sol";

/// @title Owner based access control
/// @author DigixGlobal

contract ACGroups is ACOwned {

    bool is_groups_init = false;

    struct Group {
        mapping(address => bool) members;
    }

    mapping (bytes32 => Group) groups;

    modifier if_group(bytes32 _group_name) {
        if (!groups[_group_name].members[msg.sender]) {
            throw;
        } else {
            _;
        }
    }

    modifier unless_groups_init() {
        if (is_groups_init) {
            throw;
        } else {
            _;
        }
    }

    function register_admin(address _newadmin) 
                            if_owner 
                            returns (bool _success) 
    {
        groups["admins"].members[_newadmin] = true;
        _success = true;
        return _success;
    }

    function unregister_admin(address _oldadmin) 
                              if_owner 
                              returns (bool _success) 
    {
        groups["admins"].members[_oldadmin] = false;
        _success = true;
        return _success;
    }

    function add_user_to_group(bytes32 _group, 
                               address _user) 
                               if_group("admins") 
                               public 
                               returns (bool _success) 
    {
        groups[_group].members[_user] = true;
        _success = true;
        return _success;
    }

    function delete_user_from_group(bytes32 _group, 
                                    address _user) 
                                    if_group("admins") 
                                    public 
                                    returns (bool _success) 
    {
        groups[_group].members[_user] = false;
        _success = true;
        return _success;
    }

    function is_group_member_of(bytes32 _group, 
                                address _user) 
                                public 
                                constant 
                                returns (bool _ismember) 
    {
        _ismember = groups[_group].members[_user];
        return _ismember;
    }

}
