import { useState, useEffect } from "react";
import { useContract } from "../../abi/ContractProvider";

export default function ProposalList() {
    const [proposals, setProposals] = useState([]);
    const { contract } = useContract();
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [workflowStatus, setWorkflowStatus] = useState(0);

    useEffect(() => {
        if (!contract) return;

        async function fetchProposals() {
            try {
                const fetchedProposals = await contract.getAllProposals();
                setProposals(fetchedProposals);
            } catch (error) {
                console.error("Error fetching proposals:", error);
            }
        }

        async function fetchWorkflowStatus() {
            try {
                const status = await contract.getWorkflowStatus();
                setWorkflowStatus(Number(status));
            } catch (error) {
                console.error("Error fetching workflow status:", error);
            }
        }

        fetchProposals();
        fetchWorkflowStatus();

        contract.addListener("ProposalRegistered", (proposalId) => {
            console.log(`Proposal registered: ${proposalId}`);
            fetchProposals();
        });

        contract.addListener("Voted", (voter, proposalId) => {
            console.log(`Voter ${voter} voted for proposal ${proposalId}`);
            fetchProposals();
        });

        contract.addListener("WorkflowStatusChange", (previousStatus, newStatus) => {
            console.log(`Workflow status changed from ${previousStatus} to ${newStatus}`);
            fetchWorkflowStatus();
        });

    }, [contract]);

    const handleVote = async () => {
        if (!contract || selectedProposal === null) return;

        try {
            await contract.vote(selectedProposal);
            console.log(`Voted for proposal ${selectedProposal}`);
        } catch (error) {
            console.error("Error voting:", error);
        }
    };

    return (
        <div>
            <h2>Proposals</h2>
            <ul>
                {proposals.map((proposal, index) => (
                    <li key={index}>
                        <p><strong>Description:</strong> {proposal.description}</p>
                        <p><strong>Vote Count:</strong> {proposal.voteCount.toString()}</p>
                        {workflowStatus === 3 && (
                            <button onClick={() => setSelectedProposal(index)}>
                                Select
                            </button>
                        )}
                    </li>
                ))}
            </ul>
            {workflowStatus === 3 && selectedProposal !== null && (
                <button onClick={handleVote}>Vote</button>
            )}
        </div>
    );
}
