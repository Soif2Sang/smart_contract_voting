import { useState } from "react";
import { useContract } from "../../abi/ContractProvider";

export default function ChangeWorkflow() {
    const { contract } = useContract();

    const handleChangeWorkflow = async (newStatus) => {
        if (!contract) return;

        try {
            let tx;
            if (newStatus === "openRegistration") {
                tx = await contract.openRegistration();
            } else if (newStatus === "closeRegistration") {
                tx = await contract.closeRegistration();
            } else if (newStatus === "openVoting") {
                tx = await contract.openVoting();
            } else if (newStatus === "closeVoting") {
                tx = await contract.closeVoting();
            } else if (newStatus === "tallyVotes") {
                tx = await contract.tallyVotes();
            }

            // Wait for the transaction to be confirmed
            await tx.wait();
            alert(`${newStatus} executed successfully!`);
        } catch (error) {
            console.error(error);
            alert(`Failed to change workflow to ${newStatus}.`);
        }
    };

    return (
        <div>
            <h2>Change Workflow Status</h2>
            <button onClick={() => handleChangeWorkflow("openRegistration")}>Open Registration</button>
            <button onClick={() => handleChangeWorkflow("closeRegistration")}>Close Registration</button>
            <button onClick={() => handleChangeWorkflow("openVoting")}>Open Voting</button>
            <button onClick={() => handleChangeWorkflow("closeVoting")}>Close Voting</button>
            <button onClick={() => handleChangeWorkflow("tallyVotes")}>Tally Votes</button>
        </div>
    );
}
