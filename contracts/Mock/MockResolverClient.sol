pragma solidity ^0.4.19;

import "../ResolverClient.sol";

/// @title Contract Resolver Interface
/// @author DigixGlobal

contract MockResolverClient is ResolverClient {

  function mock_set_resolver(address _resolver)
           public
  {
    resolver = _resolver;
    require(init('mock:resclient', resolver));
  }

  function test_if_sender_is (bytes32 _contract)
           if_sender_is(_contract)
           public
           constant
           returns (bool _success)
  {
    _success = true;
  }

  function test_unless_resolver_is_locked ()
           unless_resolver_is_locked ()
           public
           constant
           returns (bool _success)
  {
    _success = true;
  }

  function test_init(bytes32 _key, address _resolver)
           public
           returns (bool _success)
  {
    _success = init(_key, _resolver);
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
