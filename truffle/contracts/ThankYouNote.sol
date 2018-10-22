pragma solidity ^0.4.24;

contract ThankYouNote {

    struct Balance {
        uint sent;
        uint received;
    }

    mapping (string => Balance) private _balances;
    mapping (string => bool) private _registered;
    string[] private _users;

    uint private _totalSupply;

    event Thanks (
        uint indexed date,
        string from,
        string to,
        string messageHash,
        uint value
    );

    event AddUser (
        uint indexed date,
        string name
    );

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
    function thanks(uint date, string from, string to, string messageHash) external {
        require(!_isEqual(from, to), "from == to");
        _addUser(date, from);
        _addUser(date, to);
        _balances[from].sent = _balances[from].sent + 1;
        _balances[to].received = _balances[to].received + 1;
        _totalSupply = _totalSupply + 1;
        emit Thanks(date, from, to, messageHash, 1);
    }

    function _isEqual(string a, string b) internal pure returns (bool) {
        return keccak256(bytes(a)) == keccak256(bytes(b));
    }

    /**
    * @dev Creates a log if a new user is added
    */
    function _addUser(uint date, string name) internal {
        if(!_registered[name]) {
            _registered[name] = true;
            emit AddUser(date, name);
        }
    }
}
