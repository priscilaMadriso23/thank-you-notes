pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "./ThankYouNoteToken.sol";

contract ThankYouNote is Ownable, Pausable {

    struct Balance {
        uint sent;
        uint received;
    }

    mapping (string => Balance) private _balances;
    mapping (string => bool) private _registered;
    mapping (string => address) private _claimAddresses;
    string[] private userNames;

    uint private _totalSupply;
    ThankYouNoteToken private _token;

    event Thanks (
        uint indexed date,
        string domain,
        string from,
        string to,
        string messageHash,
        uint value
    );

    event AddUser (
        uint indexed date,
        string domain,
        string userName
    );

    constructor (address thankYouNoteToken) public {
        _token = ThankYouNoteToken(thankYouNoteToken);
    }

    /**
    * @dev Total number of tokens in existence
    */
    function totalSupply() public view returns (uint) {
        return _totalSupply;
    }

    /**
    * @dev Gets the balance of the specified user.
    * @param owner The user to query the balance of.
    * @return An uint representing the amount owned by the passed user.
    */
    function balanceOf(string owner) public view returns (uint, uint) {
        return (_balances[owner].sent, _balances[owner].received);
    }

    /**
    * @dev Give thanks from an user to another
    * @param from The user that gives.
    * @param to The user that receives.
    */
    function thanks(uint date, string domain, string from, string to, string messageHash) external {
        require(!_isEqual(from, to), "from == to");
        _addUser(date, domain, from);
        _addUser(date, domain, to);
        _balances[from].sent = _balances[from].sent + 1;
        _balances[to].received = _balances[to].received + 1;
        _totalSupply = _totalSupply + 1;
        emit Thanks(date, domain, from, to, messageHash, 1);
    }

    function claimTokens(string userName) external whenPaused {
        _token.mint(_claimAddresses[userName], _balances[userName].received);
        _balances[userName].received = 0;
        _balances[userName].sent = 0;
    }

    function registerToClaim(string userName) external {
        require(_claimAddresses[userName] == address(0), "userName already registered");
        _claimAddresses[userName] = msg.sender;
    }

    function reset() external onlyOwner {
        uint size = userNames.length;
        for (uint i = 0; i < size; i++) {
            _balances[userNames[i]].received = 0;
            _balances[userNames[i]].sent = 0;
        }
    }

    function _isEqual(string a, string b) internal pure returns (bool) {
        return keccak256(bytes(a)) == keccak256(bytes(b));
    }

    /**
    * @dev Creates a log if a new user is added
    */
    function _addUser(uint date,string domain, string userName) internal {
        if(!_registered[userName]) {
            _registered[userName] = true;
            userNames.push(userName);
            emit AddUser(date, domain, userName);
        }
    }
}
