pragma solidity ^0.4.2;

/// @title Digix Access Control for Owner
/// @author DigixGlobal

contract ACOwned {

    address public owner;
    
    /// @dev Modifier to check if msg.sender is the contract owner
    modifier ifOwner() {
        if (owner != msg.sender) {
            throw;
        } else {
            _;
        }
    }

}
