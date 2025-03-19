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
    const { workflow } = useContract();

    return (
        <div>
            <h1>Workflow Banner</h1>
            <p>Current workflow status: {workflowNames[workflow]}</p>
        </div>
    );
}
