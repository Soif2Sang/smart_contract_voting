// WorkflowBanner.js
import { useContract } from "../../abi/ContractProvider";

// Mapping of workflow status numbers to descriptive names
const workflowNames = {
    0: "RegisteringVoters",
    1: "ProposalsRegistrationStarted",
    2: "ProposalsRegistrationEnded",
    3: "VotingSessionStarted",
    4: "VotingSessionEnded",
    5: "VotesTallied"
};

export default function WorkflowBanner() {
    const { workflow } = useContract();

    return (
        <div className="p-4 bg-white shadow rounded m-4">
            <h1 className="text-xl font-semibold mb-2">Workflow Banner</h1>
            <p className="text-gray-700">Current workflow status: {workflowNames[workflow]}</p>
        </div>
    );
}
