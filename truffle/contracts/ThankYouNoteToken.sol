pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract ThankYouNoteToken is StandardToken{

  string public name = "Thank You Notes";
  string public symbol = "TYN";
  uint8 public decimals = 2;
  uint public INITIAL_SUPPLY = 150;
  
  constructor() public {
  totalSupply_ = INITIAL_SUPPLY;
  balances[msg.sender] = INITIAL_SUPPLY;
  }
}
