// SPDX-License-Identifier: UNKNOWN 
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
    constructor(address initialOwner) Ownable(initialOwner) {}

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);

    Proposal[] public proposals;
    WorkflowStatus public status;
    address[] private voterAddresses;   
    mapping(address => Voter) public whitelist;

    function getWhitelistedVoters() external view onlyOwner returns (address[] memory, Voter[] memory) {
        Voter[] memory voters = new Voter[](voterAddresses.length);
        for (uint i = 0; i < voterAddresses.length; i++) {
            voters[i] = whitelist[voterAddresses[i]];
        }
        return (voterAddresses, voters);
    }

    function getWinner() public view returns (uint) {
        require(status == WorkflowStatus.VotesTallied, "Votes are not tallied yet");
        uint winnerId = 0;
        uint winnerVotes = 0;
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > winnerVotes) {
                winnerId = i;
                winnerVotes = proposals[i].voteCount;
            }
        }
        return winnerId;
    }

    // FOR THE FRONTEND
    function getWorkflowStatus() public view returns (WorkflowStatus) {
        return status;
    }
    // FOR THE FRONTEND
    function getProposalsCount() public view returns (uint) {
        return proposals.length;
    }
    // FOR THE FRONTEND
    function getAllProposals() public view returns (Proposal[] memory) {
        return proposals;
    }
    // FOR THE FRONTEND
    function getProposal(uint _proposalId) public view returns (Proposal memory) {
        return proposals[_proposalId];
    }
    function getProposals() public view returns (Proposal[] memory) {
        return proposals;
    }
    // BONUS
    function transferOwnership(address newOwner) public override onlyOwner {
        // source: https://docs.openzeppelin.com/contracts/5.x/api/access
        emit OwnershipTransferred(owner(), newOwner);
        super.transferOwnership(newOwner);
    }
    // BONUS
    function unvote() public {
        require(whitelist[msg.sender].hasVoted, "Voter has not voted yet");
        proposals[whitelist[msg.sender].votedProposalId].voteCount--;
        whitelist[msg.sender].hasVoted = false;
        whitelist[msg.sender].votedProposalId = 0;
    }
    function isOwner() public view returns (bool) {
        return owner() == msg.sender;
    }

    function registerVoter(address _voter) external onlyOwner {
        require(!whitelist[_voter].isRegistered, "Voter already registered");
        whitelist[_voter] = Voter(true, false, 0);
        voterAddresses.push(_voter);
        emit VoterRegistered(_voter);
    }

    function registerProposal(string memory _description) external {
        require(status == WorkflowStatus.ProposalsRegistrationStarted, "Proposals registration is not open");
        require(whitelist[msg.sender].isRegistered, "Voter is not registered");
        
        // check if the proposal is not already registered
        for (uint i = 0; i < proposals.length; i++) {
            require(keccak256(abi.encodePacked(proposals[i].description)) != keccak256(abi.encodePacked(_description)), "Proposal already registered");
        }

        proposals.push(Proposal(_description, 0));
        emit ProposalRegistered(proposals.length - 1);
    }

    function vote(uint _proposalId) external {
        require(status == WorkflowStatus.VotingSessionStarted, "Voting session is not open");
        require(whitelist[msg.sender].isRegistered, "Voter is not registered");
        require(whitelist[msg.sender].hasVoted, "Voter already voted");

        proposals[_proposalId].voteCount++;
        whitelist[msg.sender].hasVoted = true;

        emit Voted(msg.sender, _proposalId);
    }

    function openRegistration() external onlyOwner {
        emit WorkflowStatusChange(status, WorkflowStatus.ProposalsRegistrationStarted);
        status = WorkflowStatus.ProposalsRegistrationStarted;
    }
    function closeRegistration() external onlyOwner {
        emit WorkflowStatusChange(status, WorkflowStatus.ProposalsRegistrationEnded);
        status = WorkflowStatus.ProposalsRegistrationEnded;
    }
    function openVoting() external onlyOwner {
        emit WorkflowStatusChange(status, WorkflowStatus.VotingSessionStarted);
        status = WorkflowStatus.VotingSessionStarted;
    }
    function closeVoting() external onlyOwner {
        emit WorkflowStatusChange(status, WorkflowStatus.VotingSessionEnded);
        status = WorkflowStatus.VotingSessionEnded;
    }
    function tallyVotes() external onlyOwner {
        emit WorkflowStatusChange(status, WorkflowStatus.VotesTallied);
        status = WorkflowStatus.VotesTallied;
    }
}