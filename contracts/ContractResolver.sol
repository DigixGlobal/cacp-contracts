pragma solidity ^0.4.11;

import "./ACGroups.sol";

/// @title Contract Name Registry
/// @author DigixGlobal

contract ContractResolver is ACGroups {

  mapping (bytes32 => address) contracts;
  event RegisterEvent(bytes32 indexed _contract_name, 
                      address indexed _contract_address);
  bool public locked;
  bool public timeLocked;
  uint public gracePeriod;

  modifier unless_registered(bytes32 _key) {
    if (contracts[_key] != 0x0) {
      throw;
    } else {
      _;
    }
  }

  modifier if_owner_origin() {
    if (tx.origin != owner) {
      throw;
    } else {
      _;
    }
  }

  modifier lock_after_period() {
    if (timeLocked && (gracePeriod < now)) {
      throw;
    } else {
      _;
    }
  }

  /// @dev ContractResolver constructor will perform the following: 1. Set msg.sender as the contract owner.  2. Adds msg.sender to the default groups 'admins' and 'nsadmins'
  function ContractResolver() 
  {
    address _sender = msg.sender;
    owner = _sender;
    locked = false;
    groups["admins"].members[_sender] = true;
    groups["nsadmins"].members[_sender] = true;
  }
    
  /// @dev Called at contract initialization
  /// @param _key bytestring for CACP name
  /// @param _contract_address The address of the contract to be registered
  /// @return _success if the operation is successful
  function init_register_contract(bytes32 _key, 
                                  address _contract_address) 
           if_owner_origin() 
           unless_registered(_key) 
           returns (bool _success) 
  {
    contracts[_key] = _contract_address;
    _success = true;
    return _success;
  }

  /// @dev Lock the resolver from any further modifications.  This can only be called from an account that is part of the nsadmins group
  /// @return _success if the operation is successful
  function lock_resolver() 
           if_group("nsadmins") 
           returns (bool _success) 
  {
    locked = true;
    _success = true;
    return _success;
  }

  /// @dev Unlock the resolver to allow further modifications.  This can only be called from an account that is part of the nsadmins group
  /// @return _success if the operation is successful
  function unlock_resolver() 
           if_group("nsadmins") 
           returns (bool _success) 
  {
     locked = false;
     _success = true;
     return _success;
  }
    
  /// @dev Enable time locking.  
  /// @param _gracePeriod the unix timestamp when the resolver is locked forever
  function enable_time_locking(uint _gracePeriod) 
           if_group("nsadmins") 
           lock_after_period() 
           returns (bool _success)
  {
    gracePeriod = _gracePeriod;
    timeLocked = true;
    _success = true;
  }

  /// @dev Register a contract.  This can only be called from an account that is part of the nsadmins group
  /// @param _key the bytestring of the contract name
  /// @param _contract the address of the contract
  /// @return _success if the operation is successful
  function register_contract(bytes32 _key, 
                             address _contract) 
           if_group("nsadmins") 
           lock_after_period()
           returns (bool _success) 
  {
    contracts[_key] = _contract;
    _success = true;
    RegisterEvent(_key, _contract);
    return _success;
  }

  /// @dev Get address of a contract
  /// @param _key the bytestring name of the contract to look up
  /// @return _contract the address of the contract
  function get_contract(bytes32 _key) 
           public 
           constant 
           returns (address _contract) 
  {
    if (contracts[_key] == address(0x0)) {
      throw;
    }
    return contracts[_key];
  }

}
