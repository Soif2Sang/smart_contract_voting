import { useContract } from "../../abi/ContractProvider";
import { useState, useEffect } from "react";

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
    const { contract } = useContract();
    const [state, setState] = useState(null);

    async function getCurrentWorkflow() {
        try {
            // Call the contract to get the workflow status
            const status = await contract.getWorkflowStatus();
            // Convert status to a number and map to a workflow name
            const statusNumber = Number(status);
            const statusName = workflowNames[statusNumber] || "Unknown";
            setState(statusName);
            console.log('Workflow status:', statusName);
        } catch (error) {
            console.error('Error getting workflow status:', error);
        }
    }

    useEffect(() => {
        if (!contract) return;

        // Fetch initial workflow status when component mounts
        getCurrentWorkflow();

        // Handler for the WorkflowStatusChange event
        const handleWorkflowChange = (previousStatus, newStatus) => {
            const newStatusNumber = Number(newStatus);
            const newStatusName = workflowNames[newStatusNumber] || "Unknown";
            setState(newStatusName);
            console.log('Workflow changed to:', newStatusName);
        };

        // Subscribe to the WorkflowStatusChange event
        contract.on("WorkflowStatusChange", handleWorkflowChange);

        // Cleanup the listener when the component unmounts
        return () => {
            contract.off("WorkflowStatusChange", handleWorkflowChange);
        };
    }, [contract]);

    return (
        <div>
            <h1>Workflow Banner</h1>
            <p>Current workflow status: {state}</p>
        </div>
    );
}
