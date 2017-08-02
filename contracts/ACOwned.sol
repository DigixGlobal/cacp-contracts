pragma solidity ^0.4.14;

/// @title Owner based access control
/// @author DigixGlobal

contract ACOwned {

  address public owner;
  bool ac_owned_init;
    
  /// @dev Modifier to check if msg.sender is the contract owner
  modifier if_owner() {
    require(is_owner());
    _;
  }

  modifier unless_ac_owned_initialized() {
    require(ac_owned_init == false);
    _;
  }

  function init_ac_owned()
           unless_ac_owned_initialized()
           internal
           returns (bool _success)
  {
    owner = msg.sender;
    _success = true;
  }

  function is_owner() 
           public
           constant
           returns (bool _is_owner)
  {
    _is_owner = (msg.sender == owner);
  }

  function change_owner(address _owner)
           if_owner()
           public
           returns (bool _success)
  {
    owner = _owner; 
    _success = true;
  }

}
