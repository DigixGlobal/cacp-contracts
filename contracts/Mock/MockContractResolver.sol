pragma solidity ^0.4.19;

import "../ContractResolver.sol";

contract MockContractResolver is ContractResolver {

    function mock_check_contracts (bytes32 _key)
             public
             constant
             returns (address _contract)
    {
      _contract = contracts[_key];
    }

    function mock_set_grace_period (uint _grace_period)
             public
    {
      grace_period = _grace_period;
    }

    function mock_get_grace_period ()
             public
             constant
             returns (uint _grace_period)
    {
      _grace_period = grace_period;
    }

    function mock_set_time_locked (bool _time_locked)
             public
    {
      time_locked = _time_locked;
    }

    function mock_set_locked (bool _locked)
             public
    {
      locked = _locked;
    }

    function mock_register_contract(address _contract, bytes32 _key) public {
      contracts[_key] = _contract;
    }

    function mock_check_locked ()
             public
             constant
             returns (bool _value)
    {
      _value = locked;
    }

    function mock_check_time_locked ()
             public
             constant
             returns (bool _value)
    {
      _value = time_locked;
    }

    function mock_check_group_member(address _user, bytes32 _group)
             public
             constant
             returns (bool _is_member)
    {
      _is_member = groups[_group].members[_user];
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

    function test_locked_after_period()
             locked_after_period()
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
