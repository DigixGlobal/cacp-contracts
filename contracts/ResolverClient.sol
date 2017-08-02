pragma solidity ^0.4.14;

import "./ContractResolver.sol";

/// @title Contract Resolver Interface
/// @author DigixGlobal

contract ResolverClient {

  /// The address of the resolver contract for this project
  address public resolver;

  /// Make our own address available to us as a constant
  address public CONTRACT_ADDRESS;

  /// Function modifier to check if msg.sender corresponds to the resolved address of a given key
  /// @param _contract The resolver key
  modifier if_sender_is(bytes32 _contract) {
    require(msg.sender == ContractResolver(resolver).get_contract(_contract));
    _;
  }

  /// Function modifier to check resolver's locking status.
  modifier unless_resolver_is_locked() {
    require(is_locked() == false);
    _;
  }

  /// @dev Initialize new contract
  /// @param _key the resolver key for this contract
  /// @return _success if the initialization is successful
  function init(bytes32 _key) 
           unless_resolver_is_locked()
           internal 
           returns (bool _success) 
  {
    CONTRACT_ADDRESS = address(this);
    _success = ContractResolver(resolver).init_register_contract(_key, CONTRACT_ADDRESS);
  }

  /// @dev Check if resolver is locked
  /// @return _locked if the resolver is currently locked
  function is_locked() 
           public 
           constant 
           returns (bool _locked) 
  {
    _locked = ContractResolver(resolver).locked();
  }

  /// @dev Get the address of a contract
  /// @param _key the resolver key to look up
  /// @return _contract the address of the contract
  function get_contract(bytes32 _key) 
           public 
           constant 
           returns (address _contract) 
  {
    _contract = ContractResolver(resolver).get_contract(_key);
  }
}
