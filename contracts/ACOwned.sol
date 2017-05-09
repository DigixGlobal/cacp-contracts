pragma solidity ^0.4.11;

/// @title Owner based access control
/// @author DigixGlobal

contract ACOwned {

    address public owner;
    
    /// @dev Modifier to check if msg.sender is the contract owner
    modifier if_owner() {
        if (owner != msg.sender) {
            throw;
        } else {
            _;
        }
    }

    function is_owner() 
                      public
                      constant
                      returns (bool _is_owner)
    {
        _is_owner = msg.sender == owner;

        return _is_owner;
    }

}
