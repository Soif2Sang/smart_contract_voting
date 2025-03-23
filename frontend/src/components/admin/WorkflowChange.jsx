import { useContract } from "../../utils/abi/ContractProvider";

export default function ChangeWorkflow() {
    const { contract, workflow } = useContract();

    const handleChangeWorkflow = async (newStatus) => {
        if (!contract) return;

        try {
            let tx;
            if (newStatus === "openVotersRegistration") {
                tx = await contract.openVotersRegistration();
            } else if (newStatus === "openRegistration") {
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

            await tx.wait();
            alert(`${newStatus} executed successfully!`);
        } catch (error) {
            console.error(error);
            alert(`Failed to change workflow to ${newStatus}.`);
        }
    };

    const workflowMap = {
        openVotersRegistration: 0,
        openRegistration: 1,
        closeRegistration: 2,
        openVoting: 3,
        closeVoting: 4,
        tallyVotes: 5,
    };

    const renderWorkflowButton = (statusName, buttonText) => {
        const isSelected = workflow === workflowMap[statusName];
        return (
            <button
                className={`text-white font-bold py-2 px-4 rounded ${
                    isSelected ? "bg-green-500" : "bg-blue-500 hover:bg-blue-700"
                }`}
                onClick={() => handleChangeWorkflow(statusName)}
            >
                {buttonText}
            </button>
        );
    };

    return (
        <div className="p-4 bg-white shadow rounded mb-4">
            <h2 className="text-lg font-semibold mb-4">Change Workflow Status</h2>
            <div className="flex flex-wrap gap-2">
                {renderWorkflowButton("openVotersRegistration", "Open Voters Registration")}
                {renderWorkflowButton("openRegistration", "Open Registration")}
                {renderWorkflowButton("closeRegistration", "Close Registration")}
                {renderWorkflowButton("openVoting", "Open Voting")}
                {renderWorkflowButton("closeVoting", "Close Voting")}
                {renderWorkflowButton("tallyVotes", "Tally Votes")}
            </div>
        </div>
    );
}
