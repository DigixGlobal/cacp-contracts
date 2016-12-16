pragma solidity ^0.4.2;

import "./ACGroups.sol";

/// @title Contract Name Registry
/// @author DigixGlobal

contract ContractResolver is ACGroups {

    mapping (bytes32 => address) contracts;
    event RegisterEvent(bytes32 indexed _contractName, address indexed _contractAddress);
    bool public locked;

    modifier unlessRegistered(bytes32 _key) {
        if (contracts[_key] != 0x0) {
            throw;
        } else {
            _;
        }
    }

    modifier ifOwnerOrigin() {
        if (tx.origin != owner) {
            throw;
        } else {
            _;
        }
    }

    /// @notice ContractResolver constructor will perform the following:
    /// 1. Set msg.sender as the contract owner
    /// 2. Adds msg.sender to the default groups 'admins' and 'nsadmins'
    function ContractResolver() {
        owner = msg.sender;
        locked = false;
        groups["admins"].members[msg.sender] = true;
        groups["nsadmins"].members[msg.sender] = true;
    }
    
    /// @notice Called at contract initialization
    /// @dev Can only be called once per instance.
    /// @param _key bytestring for CACP name
    /// @param _contractaddress The address of the contract to be registered
    /// @return _success if the operation is successful
    function initRegisterContract(bytes32 _key, address _contractaddress) ifOwnerOrigin() unlessRegistered(_key) returns (bool _success) {
        contracts[_key] = _contractaddress;
        _success = true;
        return _success;
    }

    /// @notice Lock the resolver from any further modifications
    /// @dev can only be called from an account that is part of nsadmins
    /// @return _success if the operation is successful
    function lockResolver() ifGroup("nsadmins") returns (bool _success) {
        locked = true;
        _success = true;
        return _success;
    }

    /// @notice Unlock the resolver to allow further modifications
    /// @dev can only be called from an account that is part of nsadmins
    /// @return _success if the operation is successful
    function unlockResolver() ifGroup("nsadmins") returns (bool _success) {
        locked = false;
        _success = true;
        return _success;
    }

    /// @notice Register a contract
    /// @param _key the bytestring of the contract name
    /// @param _contract the address of the contract
    /// @dev can only be called from an account that is part of nsadmins
    /// @return _success if the operation is successful
    function registerContract(bytes32 _key, address _contract) ifGroup("nsadmins") returns (bool _success) {
        contracts[_key] = _contract;
        _success = true;
        RegisterEvent(_key, _contract);
        return _success;
    }

    /// @notice Get address of a contract
    /// @param _key the bytestring name of the contract to look up
    /// @return _contract the address of the contract
    function getContract(bytes32 _key) public constant returns (address _contract) {
        if (contracts[_key] == 0x0) {
          throw;
        }
        return contracts[_key];
    }

}
