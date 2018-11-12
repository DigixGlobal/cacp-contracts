pragma solidity ^0.4.25;

import "../ContractResolver.sol";

contract MockContractResolver is ContractResolver {

    function mock_check_contracts (bytes32 _key)
             public
             constant
             returns (address _contract)
    {
      _contract = contracts[_key];
    }

    function mock_set_locked (bool _locked_forever)
             public
    {
      locked_forever = _locked_forever;
    }

    function mock_register_contract(address _contract, bytes32 _key) public {
      contracts[_key] = _contract;
    }

    function mock_check_locked ()
             public
             constant
             returns (bool _value)
    {
      _value = locked_forever;
    }

    function test_unless_registered(bytes32 _key)
             unless_registered(_key)
             public
             constant
             returns (bool _success)
    {
      _success = true;
    }

    function test_if_owner_origin()
             if_owner_origin()
             public
             constant
             returns (bool _success)
    {
      _success = true;
    }

    function test_if_not_locked()
             if_not_locked()
             public
             constant
             returns (bool _success)
    {
      _success = true;
    }

}
