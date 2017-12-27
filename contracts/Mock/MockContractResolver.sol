pragma solidity ^0.4.8;

import "../ContractResolver.sol";

contract MockContractResolver is ContractResolver {

    function mock_check_contracts (bytes32 _key)
             returns (address _contract)
    {
      _contract = contracts[_key];
    }

    function mock_set_grace_period (uint _grace_period)
    {
      grace_period = _grace_period;
    }

    function mock_get_grace_period ()
             returns (uint _grace_period)
    {
      _grace_period = grace_period;
    }

    function mock_set_time_locked (bool _time_locked)
    {
      time_locked = _time_locked;
    }

    function mock_set_locked (bool _locked)
    {
      locked = _locked;
    }

    function mock_register_contract(address _contract, bytes32 _key) {
      contracts[_key] = _contract;
    }

    function mock_check_locked ()
             returns (bool _value)
    {
      _value = locked;
    }

    function mock_check_time_locked ()
             returns (bool _value)
    {
      _value = time_locked;
    }

    function mock_check_group_member(address _user, bytes32 _group)
             returns (bool _is_member)
    {
      _is_member = groups[_group].members[_user];
    }

    function test_unless_registered(bytes32 _key)
             unless_registered(_key)
             returns (bool _success)
    {
      _success = true;
    }

    function test_if_owner_origin()
             if_owner_origin()
             returns (bool _success)
    {
      _success = true;
    }

    function test_locked_after_period()
             locked_after_period()
             returns (bool _success)
    {
      _success = true;
    }

    function test_if_not_locked()
             if_not_locked()
             returns (bool _success)
    {
      _success = true;
    }


}
