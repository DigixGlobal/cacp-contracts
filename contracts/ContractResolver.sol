pragma solidity ^0.4.19;

import "./ACGroups.sol";
import "./Constants.sol";

/// @title Contract Name Registry
/// @author DigixGlobal

contract ContractResolver is ACGroups, Constants {

  mapping (bytes32 => address) contracts;
  event RegisterEvent(bytes32 indexed _contract_name,
                      address indexed _contract_address);
  event UnRegisterEvent(bytes32 indexed _contract_name);
  bool public locked;
  bool public time_locked;
  uint public grace_period;

  modifier unless_registered(bytes32 _key) {
    require(contracts[_key] == NULL_ADDRESS);
    _;
  }

  modifier if_owner_origin() {
    require(tx.origin == owner);
    _;
  }

  /// Function modifier to check if msg.sender corresponds to the resolved address of a given key
  /// @param _contract The resolver key
  modifier if_sender_is(bytes32 _contract) {
    require(msg.sender == get_contract(_contract));
    _;
  }

  modifier locked_after_period() {
    if (time_locked == false) {
      _;
    } else {
      require(grace_period >= now);
      _;
    }
  }

  modifier if_not_locked() {
    require(locked == false);
    _;
  }

  /// @dev ContractResolver constructor will perform the following: 1. Set msg.sender as the contract owner.  2. Adds msg.sender to the default groups 'admins' and 'nsadmins'
  function ContractResolver() public
  {
    require(init_ac_groups());
    groups["nsadmins"].members[owner] = true;
    locked = false;
  }

  /// TODO: this function can basically do everything register_contract can do (except for emitting an event). Maybe we should require that this function can only be called by a contract?
  /// @dev Called at contract initialization
  /// @param _key bytestring for CACP name
  /// @param _contract_address The address of the contract to be registered
  /// @return _success if the operation is successful
  function init_register_contract(bytes32 _key, address _contract_address)
           if_owner_origin()
           if_not_locked()
           unless_registered(_key)
           locked_after_period()
           public
           returns (bool _success)
  {
    contracts[_key] = _contract_address;
    _success = true;
  }

  /// @dev Lock the resolver from any further modifications.  This can only be called from an account that is part of the nsadmins group
  /// @return _success if the operation is successful
  function lock_resolver()
           if_group("nsadmins")
           public
           returns (bool _success)
  {
    locked = true;
    _success = true;
  }

  /// @dev Unlock the resolver to allow further modifications.  This can only be called from an account that is part of the nsadmins group
  /// @return _success if the operation is successful
  function unlock_resolver()
           if_group("nsadmins")
           public
           returns (bool _success)
  {
     locked = false;
     _success = true;
  }

  /// @dev Enable time locking. This is potentially dangerous and must be from the owner
  /// @param _grace_period the unix timestamp when the resolver is locked forever
  function enable_time_locking(uint _grace_period)
           if_owner()
           locked_after_period()
           public
           returns (bool _success)
  {
    grace_period = _grace_period;
    time_locked = true;
    _success = true;
  }

  /// @dev Register a contract.  This can only be called from an account that is part of the nsadmins group
  /// @param _key the bytestring of the contract name
  /// @param _contract the address of the contract
  /// @return _success if the operation is successful
  function register_contract(bytes32 _key, address _contract)
           if_group("nsadmins")
           if_owner_origin()
           if_not_locked()
           locked_after_period()
           unless_registered(_key)
           public
           returns (bool _success)
  {
    contracts[_key] = _contract;
    RegisterEvent(_key, _contract);
    _success = true;
  }

  /// @dev Unregister a contract.  This can only be called from the contract with the key itself, which should be destroyed in the process
  /// this must also be originated from the owner of this ContractResolver as well.
  /// @param _key the bytestring of the contract name
  /// @return _success if the operation is successful
  function unregister_contract(bytes32 _key)
           locked_after_period()
           if_owner_origin()
           if_not_locked()
           if_sender_is(_key)
           public
           returns (bool _success)
  {
    delete contracts[_key];
    UnRegisterEvent(_key);
    _success = true;
  }

  /// @dev Get address of a contract
  /// @param _key the bytestring name of the contract to look up
  /// @return _contract the address of the contract
  function get_contract(bytes32 _key)
           public
           constant
           returns (address _contract)
  {
    require(contracts[_key] != NULL_ADDRESS);
    _contract = contracts[_key];
  }

  function claim_ownership()
           public
           returns (bool _success)
  {
    // revoke nsadmins role of old owner, add new owner to nsadmins
    groups["nsadmins"].members[owner] = false;
    groups["nsadmins"].members[new_owner] = true;
    _success = super.claim_ownership();
  }
}
