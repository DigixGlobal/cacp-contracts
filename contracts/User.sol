pragma solidity ^0.4.6;

import "@digix/solidity-core-libraries/contracts/MathUtils.sol";

/// @title DigixCore 2.0 User Library
/// @author DigixGlobal

library User {

  uint256 constant NANOGRAMS = 1000000000;
  uint256 constant MICROGRAMS = 1000000;
  uint256 constant MILLIGRAMS = 1000;
  
  struct Data {
    uint256 rawBalance;
    uint256 lastPaymentDate;
    address recastAddress;
    mapping (address => uint256) spenderAllowances;
    bool noDemurrage;
  }

  function getRawBalance(Data storage _data) returns (uint256 _balance) {
    _balance = _data.rawBalance;
    return _balance;
  }

  function setRawBalance(Data storage _data, uint256 _newbalance) returns (bool _success) {
    _data.rawBalance = _newbalance;
    _success = true;
    return _success;
  }
  
  function getLastPaymentDate(Data storage _data) returns (uint256 _lastpaymentdate) {
    uint256 _result = _data.lastPaymentDate;
    if (_result == 0) {
      _lastpaymentdate = now;
    } else {
      _lastpaymentdate = _result;
    }
    return _lastpaymentdate;
  }
  
  function setLastPaymentDateToNow(Data storage _data) returns (bool _success) {
    _data.lastPaymentDate = now;
    _success = true;
    return _success;
  }

  function getSpenderAllownace(Data storage _data, address _spender) returns (uint256 _allowance) {
    _allowance = _data.spenderAllowances[_spender];
    return _allowance;
  }

  function setSpenderAllowance(Data storage _data, address _spender, uint256 _amount) returns (bool _success) {
    uint256 _currentallowance = _data.spenderAllowances[_spender];
    if (_currentallowance > 0) {
      _data.spenderAllowances[_spender] = 0;
    } else {
      _data.spenderAllowances[_spender] = _amount;
    }
    _success = true;
    return _success;
  }

}
