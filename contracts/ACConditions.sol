pragma solidity ^0.4.8;

import "./Constants.sol";

/// @title Condition based access control
/// @author DigixGlobal

contract ACConditions is Constants {
   
    modifier not_null_address(address _item) {
        if (_item == NULL_ADDRESS) {
            throw;
        } else {
            _;
        }
    }

    modifier if_null_address(address _item) {
        if (_item != NULL_ADDRESS) {
            throw;
        } else {
            _;
        }
    }

    modifier not_null_uint(uint256 _item) {
        if (_item == NONE) {
            throw;
        } else {
            _;
        }
    }

    modifier if_null_uint(uint256 _item) {
        if (_item != NONE) {
            throw;
        } else {
            _;
        }
    }

    modifier not_null_bytes(bytes32 _item) {
        if (_item == EMPTY) {
            throw;
        } else {
            _;
        }
    }

    modifier if_null_bytes(bytes32 _item) {
        if (_item != EMPTY) {
            throw;
        } else {
            _;
        }
    }

    modifier not_null_string(string _item) {
        bytes memory _i = bytes(_item);
        if (_i.length == 0) {
            throw;
        } else {
            _;
        }
    }

    modifier if_null_string(string _item) {
        bytes memory _i = bytes(_item);
        if (_i.length != 0) {
            throw;
        } else {
            _;
        }
    }

    modifier require_gas(uint256 _requiredgas) {
        if (msg.gas < _requiredgas) {
            throw;
        } else {
            _;
        }
    }

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
      
      return _is_contract;
    }

    modifier if_contract(address _contract) {
      if (is_contract(_contract)) {
        _;
      } else {
        throw;
      }
    }

    modifier unless_contract(address _contract) {
      if(!is_contract(_contract)) {
        _;
      } else {
        throw;
      }
    }

}
