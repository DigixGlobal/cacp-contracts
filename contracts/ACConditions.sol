pragma solidity ^0.4.25;

import "./Constants.sol";

/// @title Condition based access control
/// @author DigixGlobal

contract ACConditions is Constants {

  modifier not_null_address(address _item) {
    require(_item != NULL_ADDRESS);
    _;
  }

  modifier if_null_address(address _item) {
    require(_item == NULL_ADDRESS);
    _;
  }

  modifier not_null_uint(uint256 _item) {
    require(_item != ZERO);
    _;
  }

  modifier if_null_uint(uint256 _item) {
    require(_item == ZERO);
    _;
  }

  modifier not_empty_bytes(bytes32 _item) {
    require(_item != EMPTY);
    _;
  }

  modifier if_empty_bytes(bytes32 _item) {
    require(_item == EMPTY);
    _;
  }

  modifier not_null_string(string _item) {
    bytes memory _i = bytes(_item);
    require(_i.length > 0);
    _;
  }

  modifier if_null_string(string _item) {
    bytes memory _i = bytes(_item);
    require(_i.length == 0);
    _;
  }

  modifier require_gas(uint256 _requiredgas) {
    require(gasleft()  >= (_requiredgas - 22000));
    _;
  }

  // WARNING: this function will not return correctly when called from the
  // constructor of _contract. It will return false instead of true
  function is_contract(address _contract)
           public
           constant
           returns (bool _is_contract)
  {
    uint32 _code_length;

    assembly {
      _code_length := extcodesize(_contract)
    }

    if(_code_length > 1) {
      _is_contract = true;
    } else {
      _is_contract = false;
    }
  }

  // WARNING: this function will not work correctly when called from the
  // constructor of _contract. It will revert instead of going through
  modifier if_contract(address _contract) {
    require(is_contract(_contract) == true);
    _;
  }

  // WARNING: this function will not work correctly when called from the
  // constructor of _contract. It will go through instead of reverting
  modifier unless_contract(address _contract) {
    require(is_contract(_contract) == false);
    _;
  }

}
