// SPDX-License-Identifier: UNKNOWN 
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Voting
 * @dev Contrat de vote permettant aux utilisateurs inscrits de proposer et voter pour des propositions.
 */
contract Voting is Ownable {

    /**
     * @dev Initialise le contrat avec un propriétaire initial.
     * @param initialOwner Adresse du propriétaire initial.
     */
    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @dev Structure représentant un électeur.
     * @param isRegistered Indique si l'électeur est inscrit.
     * @param hasVoted Indique si l'électeur a voté.
     * @param votedProposalId ID de la proposition pour laquelle l'électeur a voté.
     */
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    /**
     * @dev Structure représentant une proposition.
     * @param description Description de la proposition.
     * @param voteCount Nombre de votes reçus par la proposition.
     */
    struct Proposal {
        string description;
        uint voteCount;
    }

    /**
     * @dev Enum représentant les différentes étapes du processus de vote.
     */
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    /// @dev Événement déclenché lorsqu'un électeur est inscrit.
    event VoterRegistered(address voterAddress);
    /// @dev Événement déclenché lorsqu'un changement de statut du processus a lieu.
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    /// @dev Événement déclenché lorsqu'une proposition est enregistrée.
    event ProposalRegistered(uint proposalId);
    /// @dev Événement déclenché lorsqu'un électeur vote pour une proposition.
    event Voted(address voter, uint proposalId);

    Proposal[] public proposals;
    WorkflowStatus public status;
    address[] private voterAddresses;   
    mapping(address => Voter) public whitelist;

    /**
     * @notice Récupère la liste des électeurs inscrits.
     * @dev Accessible uniquement par le propriétaire.
     * @return Liste des adresses des électeurs et leurs informations.
     */
    function getWhitelistedVoters() external view onlyOwner returns (address[] memory, Voter[] memory) {
        Voter[] memory voters = new Voter[](voterAddresses.length);
        for (uint i = 0; i < voterAddresses.length; i++) {
            voters[i] = whitelist[voterAddresses[i]];
        }
        return (voterAddresses, voters);
    }

    /**
     * @notice Récupère l'ID et les détails de la proposition gagnante.
     * @dev Nécessite que les votes aient été comptabilisés.
     * @return L'ID de la proposition gagnante et ses détails.
     */
    function getWinner() public view returns (uint, Proposal memory) {
        require(status == WorkflowStatus.VotesTallied, "Votes are not tallied yet");
        uint winnerId = 0;
        uint winnerVotes = 0;
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > winnerVotes) {
                winnerId = i;
                winnerVotes = proposals[i].voteCount;
            }
        }
        return (winnerId, _getProposal(winnerId));
    }

    // FOR THE FRONTEND
    /**
     * @notice Récupère l'état actuel du workflow du vote.
     * @dev Utile pour l'interface utilisateur afin d'afficher la phase en cours.
     * @return L'état actuel du workflow.
     */
    function getWorkflowStatus() public view returns (WorkflowStatus) {
        return status;
    }

    // FOR THE FRONTEND
    /**
     * @notice Récupère le nombre total de propositions enregistrées.
     * @dev Permet au frontend d'afficher le nombre de propositions disponibles.
     * @return Le nombre de propositions.
     */
    function getProposalsCount() public view returns (uint) {
        return proposals.length;
    }

    // FOR THE FRONTEND
    /**
     * @notice Récupère toutes les propositions enregistrées.
     * @dev Renvoie un tableau contenant toutes les propositions soumises.
     * @return Un tableau des propositions enregistrées.
     */
    function getAllProposals() public view returns (Proposal[] memory) {
        return proposals;
    }

    /**
     * @notice Récupère une proposition spécifique en fonction de son ID.
     * @dev Fonction privée utilisée pour obtenir les détails d'une proposition.
     * @param _proposalId L'identifiant de la proposition demandée.
     * @return La proposition correspondant à l'ID fourni.
     */
    function _getProposal(uint _proposalId) private view returns (Proposal memory) {
        return proposals[_proposalId];
    }

    /**
     * @notice Récupère toutes les propositions enregistrées.
     * @dev Fonction publique similaire à `getAllProposals`, renvoie le tableau des propositions.
     * @return Un tableau des propositions enregistrées.
     */
    function getProposals() public view returns (Proposal[] memory) {
        return proposals;
    }
    
    // BONUS
    /**
     * @notice Transfère la propriété du contrat à une nouvelle adresse.
     * @dev Seul le propriétaire actuel peut exécuter cette fonction.
     * @param newOwner Adresse du nouveau propriétaire.
     */
    function transferOwnership(address newOwner) public override onlyOwner {
        // source: https://docs.openzeppelin.com/contracts/5.x/api/access
        emit OwnershipTransferred(owner(), newOwner);
        super.transferOwnership(newOwner);
    }
    
    /**
     * @notice Annule le vote d'un électeur.
     * @dev L'électeur doit avoir déjà voté.
     */
    function unvote() public {
        require(whitelist[msg.sender].hasVoted, "Voter has not voted yet");
        proposals[whitelist[msg.sender].votedProposalId].voteCount--;
        whitelist[msg.sender].hasVoted = false;
        whitelist[msg.sender].votedProposalId = 0;
    }

    // BONUS
    /**
     * @notice Vérifie si l'appelant a déjà voté.
     * @dev Retourne `true` si l'utilisateur a voté, sinon `false`.
     * @return Booléen indiquant si l'utilisateur a déjà voté.
     */
    function hasVoted() public view returns (bool) {
        return whitelist[msg
        .sender].hasVoted;
    }

    /**
     * @notice Vérifie si l'appelant est le propriétaire du contrat.
     * @dev Compare l'adresse de l'appelant avec celle du propriétaire actuel.
     * @return Booléen indiquant si l'utilisateur est le propriétaire.
     */
    function isOwner() public view returns (bool) {
        return owner() == msg.sender;
    }

    /**
     * @notice Inscrit un nouvel électeur.
     * @dev Accessible uniquement par le propriétaire et possible uniquement pendant la phase d'inscription des électeurs.
     * @param _voter Adresse de l'électeur à inscrire.
     */
    function registerVoter(address _voter) external onlyOwner {
        require(!whitelist[_voter].isRegistered, "Voter already registered");
        require(status == WorkflowStatus.RegisteringVoters, "Voters registration is not open");
        whitelist[_voter] = Voter(true, false, 0);
        voterAddresses.push(_voter);
        emit VoterRegistered(_voter);
    }

    /**
     * @notice Enregistre une nouvelle proposition.
     * @dev L'utilisateur doit être inscrit et la phase d'enregistrement des propositions doit être ouverte.
     * @param _description Description de la proposition.
     */
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

    /**
     * @notice Permet à un électeur de voter pour une proposition.
     * @dev L'utilisateur doit être inscrit, la session de vote doit être ouverte et il ne doit pas avoir déjà voté.
     * @param _proposalId ID de la proposition pour laquelle voter.
     */
    function vote(uint _proposalId) external {
        require(status == WorkflowStatus.VotingSessionStarted, "Voting session is not open");
        require(whitelist[msg.sender].isRegistered, "Voter is not registered");
        require(!whitelist[msg.sender].hasVoted, "Voter already voted");

        proposals[_proposalId].voteCount++;
        whitelist[msg.sender].hasVoted = true;

        emit Voted(msg.sender, _proposalId);
    }

    /// @dev Ouvre la phase d'enregistrement des électeurs. Ce changement de statut est émis.
    function openVotersRegistration() external onlyOwner {
        emit WorkflowStatusChange(status, WorkflowStatus.RegisteringVoters);
        status = WorkflowStatus.RegisteringVoters;
    }

    /// @dev Ouvre la phase d'enregistrement des propositions. Ce changement de statut est émis.
    function openRegistration() external onlyOwner {
        emit WorkflowStatusChange(status, WorkflowStatus.ProposalsRegistrationStarted);
        status = WorkflowStatus.ProposalsRegistrationStarted;
    }

    /// @dev Ferme la phase d'enregistrement des propositions. Ce changement de statut est émis.
    function closeRegistration() external onlyOwner {
        emit WorkflowStatusChange(status, WorkflowStatus.ProposalsRegistrationEnded);
        status = WorkflowStatus.ProposalsRegistrationEnded;
    }

    /// @dev Ouvre la phase de vote. Ce changement de statut est émis.
    function openVoting() external onlyOwner {
        emit WorkflowStatusChange(status, WorkflowStatus.VotingSessionStarted);
        status = WorkflowStatus.VotingSessionStarted;
    }

    /// @dev Ferme la phase de vote. Ce changement de statut est émis.
    function closeVoting() external onlyOwner {
        emit WorkflowStatusChange(status, WorkflowStatus.VotingSessionEnded);
        status = WorkflowStatus.VotingSessionEnded;
    }

    /// @dev Effectue le dépouillement des votes. Ce changement de statut est émis.
    function tallyVotes() external onlyOwner {
        emit WorkflowStatusChange(status, WorkflowStatus.VotesTallied);
        status = WorkflowStatus.VotesTallied;
    }
}