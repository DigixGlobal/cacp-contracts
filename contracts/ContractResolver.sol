pragma solidity ^0.4.25;

import "./ACOwned.sol";
import "./Constants.sol";

/// @title Contract Name Registry
/// @author DigixGlobal

contract ContractResolver is ACOwned, Constants {

  mapping (bytes32 => address) contracts;
  bool public locked_forever;

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

  modifier if_not_locked() {
    require(locked_forever == false);
    _;
  }

  /// @dev ContractResolver constructor will perform the following: 1. Set msg.sender as the contract owner.
  constructor() public
  {
    require(init_ac_owned());
    locked_forever = false;
  }

  /// @dev Called at contract initialization
  /// @param _key bytestring for CACP name
  /// @param _contract_address The address of the contract to be registered
  /// @return _success if the operation is successful
  function init_register_contract(bytes32 _key, address _contract_address)
           if_owner_origin()
           if_not_locked()
           unless_registered(_key)
           public
           returns (bool _success)
  {
    require(_contract_address != NULL_ADDRESS);
    contracts[_key] = _contract_address;
    _success = true;
  }

  /// @dev Lock the resolver from any further modifications.  This can only be called from the owner
  /// @return _success if the operation is successful
  function lock_resolver_forever()
           if_owner
           public
           returns (bool _success)
  {
    locked_forever = true;
    _success = true;
  }

  /// @dev Get address of a contract
  /// @param _key the bytestring name of the contract to look up
  /// @return _contract the address of the contract
  function get_contract(bytes32 _key)
           public
           view
           returns (address _contract)
  {
    require(contracts[_key] != NULL_ADDRESS);
    _contract = contracts[_key];
  }

}
