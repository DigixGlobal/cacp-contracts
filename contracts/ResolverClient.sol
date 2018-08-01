pragma solidity ^0.4.19;

import "./ContractResolver.sol";
import "./ACOwned.sol";

/// @title Contract Resolver Interface
/// @author DigixGlobal

contract ResolverClient {

  /// The address of the resolver contract for this project
  address public resolver;
  bytes32 public key;

  /// Make our own address available to us as a constant
  address public CONTRACT_ADDRESS;

  /// Function modifier to check if msg.sender corresponds to the resolved address of a given key
  /// @param _contract The resolver key
  modifier if_sender_is(bytes32 _contract) {
    require(sender_is(_contract));
    _;
  }

  function sender_is(bytes32 _contract) internal view returns (bool _isFrom) {
    _isFrom = msg.sender == ContractResolver(resolver).get_contract(_contract);
  }

  modifier if_sender_is_from(bytes32[3] _contracts) {
    require(sender_is_from(_contracts));
    _;
  }

  function sender_is_from(bytes32[3] _contracts) internal view returns (bool _isFrom) {
    uint256 _n = _contracts.length;
    for (uint256 i = 0; i < _n; i++) {
      if (_contracts[i] == bytes32(0x0)) continue;
      if (msg.sender == ContractResolver(resolver).get_contract(_contracts[i])) {
        _isFrom = true;
      }
    }
  }

  /// Function modifier to check resolver's locking status.
  modifier unless_resolver_is_locked() {
    require(is_locked() == false);
    _;
  }

  /// @dev Initialize new contract
  /// @param _key the resolver key for this contract
  /// @return _success if the initialization is successful
  function init(bytes32 _key, address _resolver)
           internal
           returns (bool _success)
  {
    bool _is_locked = ContractResolver(_resolver).locked();
    if (_is_locked == false) {
      CONTRACT_ADDRESS = address(this);
      resolver = _resolver;
      key = _key;
      require(ContractResolver(resolver).init_register_contract(key, CONTRACT_ADDRESS));
      _success = true;
    }  else {
      _success = false;
    }
  }

  /// @dev Destroy the contract and unregister self from the ContractResolver
  /// @dev Can only be called by the owner of ContractResolver
  /* function destroy()
           public
           returns (bool _success)
  {
    bool _is_locked = ContractResolver(resolver).locked();
    require(!_is_locked);

    address _owner_of_contract_resolver = ContractResolver(resolver).owner();
    require(msg.sender == _owner_of_contract_resolver);

    _success = ContractResolver(resolver).unregister_contract(key);
    require(_success);

    selfdestruct(_owner_of_contract_resolver);
  } */

  /// @dev Check if resolver is locked
  /// @return _locked if the resolver is currently locked
  function is_locked()
           private
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
