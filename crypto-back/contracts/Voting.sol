pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint[] votedProposalIds;
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

    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );

    event VoterRegistered(address voterAddress);

    event ProposalRegistered(uint proposalId);

    event Voted(address voter, uint[] proposalIds);

    WorkflowStatus public workflowStatus;
    mapping(address => Voter) public voters;
    mapping(uint => Proposal) public proposals;
    uint public numProposals;
    uint public winningProposalId;

    constructor(address initialOwner) Ownable(initialOwner) {
        numProposals = 0;
        workflowStatus = WorkflowStatus.RegisteringVoters;
    }

    function registerVoter(address voterAddress) public onlyOwner {
        voters[voterAddress] = Voter({
            isRegistered: true,
            hasVoted: false,
            votedProposalIds: new uint[](0)
        });

        emit VoterRegistered(voterAddress);
    }

    function startProposalsRegistration() public onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters);

        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;

        emit WorkflowStatusChange(
            WorkflowStatus.RegisteringVoters,
            WorkflowStatus.ProposalsRegistrationStarted
        );
    }

    function registerProposal(string memory description) public onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted);

        uint proposalId = numProposals + 1;

        proposals[proposalId] = Proposal({
            description: description,
            voteCount: 0
        });

        numProposals++;

        emit ProposalRegistered(proposalId);
    }

    function endProposalsRegistration() public onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted);

        require(numProposals > 0);

        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;

        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationStarted,
            WorkflowStatus.ProposalsRegistrationEnded
        );
    }

    function startVotingSession() public onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded);

        workflowStatus = WorkflowStatus.VotingSessionStarted;

        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationEnded,
            WorkflowStatus.VotingSessionStarted
        );
    }

    function vote(uint[] memory proposalIds) public payable {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted);

        Voter storage voter = voters[msg.sender];

        require(!voter.hasVoted);

        for (uint i = 0; i < proposalIds.length; i++) {
            proposals[proposalIds[i]].voteCount++;
        }

        voter.votedProposalIds = proposalIds;
        voter.hasVoted = true;

        emit Voted(msg.sender, proposalIds);
    }

    function endVotingSession() public onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted);

        workflowStatus = WorkflowStatus.VotingSessionEnded;

        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionStarted,
            WorkflowStatus.VotingSessionEnded
        );

        // Calculate the winner

        for (uint8 i = 1; i <= numProposals; i++) {
            if (
                proposals[i].voteCount > proposals[winningProposalId].voteCount
            ) {
                winningProposalId = i;
            }
        }
    }

    function isOwner() public view returns (bool) {
        return msg.sender == owner();
    }

    function getWinner() public view returns (uint) {
        return winningProposalId;
    }
}
