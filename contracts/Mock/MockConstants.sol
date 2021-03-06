pragma solidity ^0.4.19;
import '../Constants.sol';
/// @title Some useful constants
/// @author DigixGlobal

contract MockConstants is Constants{
  address constant NULL_ADDRESS = address(0x0);
  uint256 constant ZERO = uint256(0);
  bytes32 constant EMPTY = bytes32(0x0);

  function test_constants() public pure returns (address, uint256, bytes32) {
    return (NULL_ADDRESS, ZERO, EMPTY);
  }

}
