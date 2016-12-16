pragma solidity ^0.4.6;

import "./ContractResolver.sol";

/// @title Contract Resolver Interface
/// @author DigixGlobal

contract ResolverClient {

  /// The address of the resolver contract for this project
  address public resolver;

  /// Make our own address available to us as a constant
  address public constant CONTRACT_ADDRESS = address(this);

  /// Function modifier to check if msg.sender corresponds to the resolved address of a given key
  /// @param _contract The resolver key
  modifier ifSenderIs(bytes32 _contract) {
    if (msg.sender != ContractResolver(resolver).getContract(_contract)) {
      throw;
    } else {
      _;
    }
  }

  /// Function modifier to check resolver's locking status.
  modifier unlessResolverIsLocked() {
    if (isLocked()) {
      throw;
    } else {
      _;
    }
  }

  /// @dev Initialize new contract
  /// @param _key the resolver key for this contract
  /// @return _success if the initialization is successful
  function init(bytes32 _key) internal returns (bool _success) {
    _success = ContractResolver(resolver).initRegisterContract(_key, CONTRACT_ADDRESS);
    return _success;
  }

  /// @dev Check if resolver is locked
  /// @return _locked if the resolver is currently locked
  function isLocked() public constant returns (bool _locked) {
    _locked = ContractResolver(resolver).locked();
    return _locked;
  }

  /// @dev Get the address of a contract
  /// @param _key the resolver key to look up
  /// @return _contract the address of the contract
  function getContract(bytes32 _key) public constant returns (address _contract) {
    _contract = ContractResolver(resolver).getContract(_key);
    return _contract;
  }
}
