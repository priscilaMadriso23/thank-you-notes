pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./ThankYouNoteToken.sol";

contract ThankYouNote is Ownable {

    /* attributes section */

    struct Balance {
        uint sent;
        uint received;
    }

    mapping (string => Balance) private _balances;
    mapping (string => bool) private _registered;

    mapping (string => address) private _claimAddresses;
    string[] private userNames;

    uint private _totalSupply;
    uint8 private _decimals;

    ThankYouNoteToken private _token;

    /* events section */

    event Thanks (
        uint indexed date,
        string domain,
        string from,
        string to,
        string messageHash,
        uint qty
    );

    event AddUser (
        uint indexed date,
        string domain,
        string userName
    );

    event ClaimTokens (
        uint indexed date,
        string userName
    );

    /* modifiers section */

    modifier notRegistered(string userName) {
        require(_claimAddresses[userName] == address(0), "userName already registered");
        _;
    }

    modifier registered(string userName) {
        require(_claimAddresses[userName] != address(0), "userName not registered");
        _;
    }

    /* public functions section */

    constructor (address thankYouNoteToken, uint8 decimals) public {
        _token = ThankYouNoteToken(thankYouNoteToken);
        _decimals = decimals;
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
    * @param date the date in epoch format
    * @param from The user that gives.
    * @param to The user that receives.
    * @param messageHash The message hash
    * @param qty The tyn quantity
    */
    function thanks(uint date, string domain, string from, string to, string messageHash, uint qty) external {
        require(!_isEqual(from, to), "from == to");
        _addUser(date, domain, from);
        _addUser(date, domain, to);
        _balances[from].sent = _balances[from].sent + qty;
        _balances[to].received = _balances[to].received + qty;
        _totalSupply = _totalSupply + qty;
        emit Thanks(date, domain, from, to, messageHash, qty);
    }

    /**
    * @dev Claims the current received qty in form of TYN tokens
    * @param date the date in epoch format
    * @param userName The user that claims tokens.
    */
    function claimTokens(uint date, string userName) external registered(userName) {
        _token.mint(_claimAddresses[userName], _balances[userName].received);
        _balances[userName].received = 0;
        _balances[userName].sent = 0;
        emit ClaimTokens(date, userName);
    }

    /**
    * @dev Register an user address to enable to claim tokens
    * @param userName The user that claims tokens.
    */
    function registerToClaim(string userName) external notRegistered(userName) {
        _claimAddresses[userName] = msg.sender;
    }

    /**
    * @dev Reset all counters
    */
    function reset() external onlyOwner {
        uint size = userNames.length;
        for (uint i = 0; i < size; i++) {
            _balances[userNames[i]].received = 0;
            _balances[userNames[i]].sent = 0;
        }
        _totalSupply = 0;
    }

    /**
    * @return the number of decimals.
    */
    function decimals() public view returns(uint8) {
        return _decimals;
    }

    /* internal functions section */

    /**
    * @dev checks if two strings are equal
    */
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
