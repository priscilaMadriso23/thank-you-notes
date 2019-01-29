pragma solidity ^0.4.15;


contract Nomination {
    
    struct NominationBalance {
        uint sent;
        uint received;
    }
   
    mapping (string => NominationBalance) _balances;
    // user => nominatedBy => category => true/false
    mapping (string => mapping(string => mapping(uint => bool))) _nominations;
    // user => nominatedBy => category => true/false (If someone already voted)
    mapping (string => mapping(string => mapping(uint => bool))) _votes;
    // category => user => true/false (If user've already nominated)
    mapping (uint => mapping(string => bool)) _nominatedCategory;
    // category => user => votesCount
    mapping (uint => mapping(string => uint)) _votesBalances;
    // category => nominees
    mapping(uint => string[]) _nominees;
    event Nominate(
            string nominee,
            string nominatedBy,
            uint category
    );
    modifier notAlreadyNominated(string nominee, string nominatedBy,uint category){
        require(!_nominations[nominee][nominatedBy][category], "Already Nominated");
        _;
    }
    
    modifier alreadyVoted(string voter,string nominee,uint category){
        require(!_votes[voter][nominee][category], "Already voted to this user");
        _;
    }
     modifier isNominated(string nominee,uint category){
        require(_nominatedCategory[category][nominee], "User've been nominated");
        _;
    }
        
    
    function nominate(string _nominee, string _nominatedBy,uint _category) 
        public 
        notAlreadyNominated(_nominee, _nominatedBy, _category)
    {
        _nominations[_nominee][_nominatedBy][_category] = true;
        _balances[_nominatedBy].sent = _balances[_nominatedBy].sent + 1;
        _balances[_nominee].received = _balances[_nominee].received + 1;
        if (!_nominatedCategory[_category][_nominee])
        {
            _nominees[_category].push(_nominee);
            _nominatedCategory[_category][_nominee]=true;
            
        }
        emit Nominate(_nominee, _nominatedBy, _category);
    }
    
    function vote(string _voter,string _nominee,uint _category)
        public
        alreadyVoted(_voter,_nominee,_category)
        isNominated(_nominee,_category)
    {
        _votes[_voter][_nominee][_category]=true;
        _votesBalances[_category][_nominee]=_votesBalances[_category][_nominee]+1;
    }
    
    function getWinner(uint category) constant
        public
        returns (string winningNominee)
    {
        uint winningVoteCount = 0;
        for (uint n = 0; n < _nominees[category].length; n++)
        {
            if (_votesBalances[category][_nominees[category][n]] > winningVoteCount)
            {
                winningVoteCount = _votesBalances[category][_nominees[category][n]];
                winningNominee = _nominees[category][n];
            }
        }
    }
}
