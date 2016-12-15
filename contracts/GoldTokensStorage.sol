pragma solidity ^0.4.6;

import "./User.sol";
import "./Asset.sol";

contract GoldTokensStorage {
  using User for User.Data;
  using Asset for Asset.Data;

  mapping (address => User.Data) public users;
  mapping (uint256 => Asset.Data) public assets;

  uint256 public assetCount;

  function GoldTokenStorage() {
    assetCount = 0;
  }

  function createAsset(uint256 _nanogramweight, bytes32 _serial) returns (uint256 _assetid) {
    assetCount++;
    assets[assetCount] = Asset.create(_nanogramweight, _serial);
    _assetid = assetCount;
    return _assetid;
  }

  function getAsset(uint256 _assetid) returns (uint256 _weight, bytes32 _serial, uint256 _laststoragepayment, address _owner) {
    (_weight, _serial, _laststoragepayment, _owner) = assets[_assetid].getData();
    return (_weight, _serial, _laststoragepayment, _owner);
  }

  function getBalance(address _user) public constant returns (uint256 _balance) {
    _balance = users[_user].getRawBalance();
    return _balance;
  }

  function setBalance(address _user, uint256 _newbalance) returns (bool _success) {
    users[_user].setRawBalance(_newbalance);
    _success = true;
    return _success;
	}
  
  function getLastPaymentDate(address _user) returns (uint256 _lastpaymentdate) {
    _lastpaymentdate = users[_user].getLastPaymentDate();
    return _lastpaymentdate;
  }

  function payStorageFee(address _user) returns (bool _success) {
    _success = users[_user].setLastPaymentDateToNow();
    return _success;
  }
}
