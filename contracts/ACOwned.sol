pragma solidity ^0.4.8;

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

}
