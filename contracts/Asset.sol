pragma solidity ^0.4.6;

import "@digix/solidity-core-libraries/contracts/MathUtils.sol";

/// @title DigixCore 2.0 Asset Library
/// @author DigixGlobal

library Asset {

  struct Data {
    uint256 weight;
    bytes32 serial;
    uint256 lastStoragePayment;
    address owner;
  }

  function getWeight(Data storage _asset) returns (uint256 _nanogramweight) {
    _nanogramweight = _asset.weight;
    return _nanogramweight;
  }

  function getSerial(Data storage _asset) returns (bytes32 _serial) {
    _serial = _asset.serial;
    return _serial;
  }

  function getLastStoragePayment(Data storage _asset) returns (uint256 _laststoragepayment) {
    _laststoragepayment = _asset.lastStoragePayment;
    return _laststoragepayment;
  }

  function getOwner(Data storage _asset) returns (address _owner) {
    _owner = _asset.owner;
    return _owner;
  }

  function getData(Data storage _asset) returns (uint256 _weight, bytes32 _serial, uint256 _laststoragepayment, address _owner) {
    (_weight, _serial, _laststoragepayment, _owner) = (_asset.weight, _asset.serial, _asset.lastStoragePayment, _asset.owner);
    return (_weight, _serial, _laststoragepayment, _owner);
  }

  function create(uint256 _nanogramweight, bytes32 _serial) internal returns (Data _asset) {
    _asset.weight = _nanogramweight;
    _asset.serial = _serial;
    _asset.lastStoragePayment = now;
    _asset.owner = msg.sender;
    return _asset;
  }

  function setLastStoragePayment(Data storage _asset) returns (bool _success) {
    _asset.lastStoragePayment = now;
    _success = true;
    return _success;
  }

}
