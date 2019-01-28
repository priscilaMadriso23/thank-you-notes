pragma solidity ^0.4.24;
contract RecognitionsVoting{
    
    struct Nomination{
        string nominatedBy; 
        string nominee; 
        string category; 
        string refData;
        string quarter; //1-2019(quarter-year)
    }
    
    
    //Mappings to handle votes
    //category -> nominee -> votes
    mapping(string => mapping( string => uint )) votesCategoryPerNominee;
    //category -> highestNominee
    mapping(string => string) highestNomineePerCategory;
    
    //Mappings for validations
    //category -> nominatedBy -> true/false(if someone was already voted)
    mapping(string => mapping( string => bool )) votedCategory;
    //category -> nominee -> quarter -> true/false (if someone was already nominated) 
    mapping(string => mapping( string => mapping( string => bool) )) nominedCategory;
    
    
    event savedNominee(
            string nominatedBy, 
            string nominee, 
            string category, 
            string quarter
    );
    event savedVote(
            string nominatedBy, 
            string nominee, 
            string category, 
            uint highestVote
    );
    
    //Check if the nominee was nominated
    modifier nomineeExists(string _category, string _to, string _quarter){
        require(
            nominedCategory[_category][_to][_quarter] == true,
            'You only can vote for someone nomined.'
        );
        _;
    }
    
    //Check if the voter already voted for the nominee
    modifier checkVoteOnce(string _category, string _nominatedBy){
        require(
             votedCategory[_category][_nominatedBy] == false,
             'You already voted on this category.'
        );
        _;
    }
    
    //Check the nominee is nominated just one time
    modifier nomineeJustOnce(string _category, string _nominee, string _quarter){
        require(
            nominedCategory[_category][_nominee][_quarter] == false,
            'The nomimee was already nominated person.'
        );
        _;
    }
    
    
    function saveNomination(string _nominatedBy, string _nominee, string _category, string _refData, string _quarter) public nomineeJustOnce(_category, _nominee, _quarter){
        Nomination({
         nominatedBy: _nominatedBy,
         nominee: _nominee,
         category: _category,
         quarter: _quarter,
         refData: _refData
        });
        nominedCategory[_category][_nominee][_quarter] = true;
        emit savedNominee(_nominatedBy, _nominee, _category, _quarter); 
    }
    
    function votePerCategory(string _nominatedBy, string _nominee, string _category, string _quarter) public nomineeExists(_category, _nominee, _quarter) checkVoteOnce(_category,_nominatedBy)  {
        uint votes = votesCategoryPerNominee[_category][_nominee] + 1;
        uint highestVote = votesCategoryPerNominee[_category][highestNomineePerCategory[_category]]; 
    
        votesCategoryPerNominee[_category][_nominee] = votes;
        if( votes > highestVote){
            highestNomineePerCategory[_category] = _nominee ;
        }
        
        votedCategory[_category][_nominatedBy] = true;
        emit savedVote(_nominatedBy, _nominee, _category, highestVote); 
    }
    
    function getHighestNomineePerCategory( string _category) public view returns(string){
        return highestNomineePerCategory[_category];
    }
     function getVotesNomineePerCategory( string _category, string _nominee) public view returns(uint){
        return votesCategoryPerNominee[_category][_nominee];
    }
}