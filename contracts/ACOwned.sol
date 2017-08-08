pragma solidity ^0.4.14;

/// @title Owner based access control
/// @author DigixGlobal

contract ACOwned {

  address public owner;
  bool is_ac_owned_init;
    
  /// @dev Modifier to check if msg.sender is the contract owner
  modifier if_owner() {
    require(is_owner());
    _;
  }

  function init_ac_owned()
           internal
           returns (bool _success)
  {
    if (is_ac_owned_init == false) {
      owner = msg.sender;
      is_ac_owned_init = true;
    }
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
