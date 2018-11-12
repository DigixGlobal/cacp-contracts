pragma solidity ^0.4.25;

import "../ACConditions.sol";

/// @title Condition based access control
/// @author DigixGlobal

contract MockACConditions is ACConditions {

  function test_not_null_address (address _item) not_null_address(_item) public pure returns (bool _success){
    return true;
  }

  function test_if_null_address (address _item) if_null_address(_item) public pure returns (bool _success){
    return true;
  }

  function test_not_null_uint (uint256 _item) not_null_uint(_item) public pure returns (bool _success){
    return true;
  }

  function test_if_null_uint (uint256 _item) if_null_uint(_item) public pure returns (bool _success){
    return true;
  }

  function test_not_empty_bytes (bytes32 _item) not_empty_bytes(_item) public pure returns (bool _success){
    return true;
  }

  function test_if_empty_bytes (bytes32 _item) if_empty_bytes(_item) public pure returns (bool _success){
    return true;
  }

  function test_not_null_string (string _item) not_null_string(_item) public pure returns (bool _success) {
    return true;
  }

  function test_if_null_string (string _item) if_null_string(_item) public pure returns (bool _success) {
    return true;
  }

  function test_require_gas (uint256 _requiredgas) require_gas(_requiredgas) public constant returns (bool _success) {
    return true;
  }

  function test_if_contract (address _contract) if_contract(_contract) public constant returns (bool _success) {
    return true;
  }

  function test_unless_contract (address _contract) unless_contract(_contract) public constant returns (bool _success) {
    return true;
  }
}
