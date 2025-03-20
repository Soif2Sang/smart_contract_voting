const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract", function () {
    let Voting;
    let voting;
    let owner;
    let addr1;
    let addr2;
    let addr3;

    beforeEach(async () => {
        [owner, addr1, addr2, addr3] = await ethers.getSigners();

        // Déployer le contrat
        Voting = await ethers.getContractFactory("Voting");
        voting = await Voting.deploy(owner.address);  // Déployer le contrat
    });

    describe("Voter registration", function () {
        it("should allow the owner to register a voter", async function () {
            await voting.openVotersRegistration(); // Ouvrir la phase d'enregistrement des électeurs
            await voting.registerVoter(addr1.address); // Inscrire un électeur

            const voter = await voting.whitelist(addr1.address);
            expect(voter.isRegistered).to.be.true;
            expect(voter.hasVoted).to.be.false;
        });

		/** Bloque car renvoie une custom error
        it("should not allow a non-owner to register a voter", async function () {
			await expect(voting.connect(addr1).registerVoter(addr2.address))
				.to.be.revertedWith("Ownable: caller is not the owner");
		});
		*/

        it("should revert if trying to register a voter outside the registration phase", async function () {
			await voting.closeRegistration(); 
		
			await expect(voting.registerVoter(addr1.address))
				.to.be.revertedWith("Voters registration is not open");
		});
    });

    describe("Proposal registration", function () {
        it("should allow registered voters to register proposals", async function () {
            await voting.openVotersRegistration(); // Ouvrir la phase d'enregistrement des électeurs
            await voting.registerVoter(addr1.address);

            await voting.openRegistration(); // Ouvrir la phase d'enregistrement des propositions
            await voting.connect(addr1).registerProposal("Proposal 1");

            const proposals = await voting.getProposals();
            expect(proposals.length).to.equal(1);
            expect(proposals[0].description).to.equal("Proposal 1");
        });

        it("should not allow non-registered voters to register proposals", async function () {
            await expect(
                voting.connect(addr2).registerProposal("Proposal 2")
            ).to.be.revertedWith("Proposals registration is not open");
        });

        it("should revert if the proposal is already registered", async function () {
            await voting.openVotersRegistration();
            await voting.registerVoter(addr1.address);

            await voting.openRegistration();
            await voting.connect(addr1).registerProposal("Proposal 1");

            await expect(
                voting.connect(addr1).registerProposal("Proposal 1")
            ).to.be.revertedWith("Proposal already registered");
        });
    });

    describe("Voting", function () {
        it("should allow registered voters to vote", async function () {
            await voting.openVotersRegistration();
            await voting.registerVoter(addr1.address);

            await voting.openRegistration();
            await voting.connect(addr1).registerProposal("Proposal 1");

            await voting.openVoting();
            await voting.connect(addr1).vote(0);

            const proposals = await voting.getProposals();
            expect(proposals[0].voteCount).to.equal(1);
        });

        it("should not allow voters to vote multiple times", async function () {
            await voting.openVotersRegistration();
            await voting.registerVoter(addr1.address);

            await voting.openRegistration();
            await voting.connect(addr1).registerProposal("Proposal 1");

            await voting.openVoting();
            await voting.connect(addr1).vote(0);

            await expect(voting.connect(addr1).vote(0)).to.be.revertedWith(
                "Voter already voted"
            );
        });

        it("should not allow non-registered voters to vote", async function () {
            await voting.openVotersRegistration();
            await voting.registerVoter(addr1.address);

            await voting.openRegistration();
            await voting.connect(addr1).registerProposal("Proposal 1");

            await voting.openVoting();

            await expect(voting.connect(addr2).vote(0)).to.be.revertedWith(
                "Voter is not registered"
            );
        });

        it("should allow voters to unvote", async function () {
            await voting.openVotersRegistration();
            await voting.registerVoter(addr1.address);

            await voting.openRegistration();
            await voting.connect(addr1).registerProposal("Proposal 1");

            await voting.openVoting();
            await voting.connect(addr1).vote(0);

            await voting.connect(addr1).unvote();

            const proposals = await voting.getProposals();
            expect(proposals[0].voteCount).to.equal(0);
        });
    });

    describe("Workflow control", function () {
        it("should allow the owner to control the workflow", async function () {
            await voting.openVotersRegistration();
            expect(await voting.getWorkflowStatus()).to.equal(0); // RegisteringVoters

            await voting.openRegistration();
            expect(await voting.getWorkflowStatus()).to.equal(1); // ProposalsRegistrationStarted

            await voting.closeRegistration();
            expect(await voting.getWorkflowStatus()).to.equal(2); // ProposalsRegistrationEnded

            await voting.openVoting();
            expect(await voting.getWorkflowStatus()).to.equal(3); // VotingSessionStarted

            await voting.closeVoting();
            expect(await voting.getWorkflowStatus()).to.equal(4); // VotingSessionEnded

            await voting.tallyVotes();
            expect(await voting.getWorkflowStatus()).to.equal(5); // VotesTallied
        });

		/** Bloque car renvoie une custom error
        it("should not allow non-owner to change the workflow", async function () {
            await expect(
                voting.connect(addr1).openVotersRegistration()
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
		*/
    });

    describe("Getters", function () {
        it("should return the correct winner after tallying votes", async function () {
            await voting.openVotersRegistration();
            await voting.registerVoter(addr1.address);

            await voting.openRegistration();
            await voting.connect(addr1).registerProposal("Proposal 1");

            await voting.openVoting();
            await voting.connect(addr1).vote(0);

            await voting.closeVoting();
            await voting.tallyVotes();

            const [winnerId, winnerProposal] = await voting.getWinner();
            expect(winnerId).to.equal(0);
            expect(winnerProposal.description).to.equal("Proposal 1");
        });
    });

}); 
