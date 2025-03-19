import { useState, useEffect } from "react";
import { useContract } from "../../abi/ContractProvider";

export default function ProposalList() {
    const [proposals, setProposals] = useState([]);
    const { contract, workflow } = useContract();
    const [selectedProposal, setSelectedProposal] = useState(null);

    useEffect(() => {
        if (!contract) return;

        const fetchProposals = async () => {
            try {
                const fetchedProposals = await contract.getAllProposals();
                console.log('Fetched proposals:', fetchedProposals);
                setProposals(fetchedProposals);
            } catch (error) {
                console.error("Error fetching proposals:", error);
            }
        };

        fetchProposals();

        const proposalRegisteredListener = () => {
            console.log("fetch Proposal")
            fetchProposals();
        };

        const votedListener = () => {
            fetchProposals();
        };


        contract.on("ProposalRegistered", proposalRegisteredListener);
        contract.addListener("ProposalRegistered", proposalRegisteredListener);
        contract.on("Voted", votedListener);
        contract.addListener("Voted", votedListener);

        return () => {
            contract.removeListener("ProposalRegistered", proposalRegisteredListener);
            contract.removeListener("Voted", votedListener);
        };

    }, [contract]);

    const handleVote = async () => {
        if (!contract || selectedProposal === null) return;

        try {
            await contract.vote(selectedProposal);
            console.log(`Voted for proposal ${selectedProposal}`);
        } catch (error) {
            alert("Error voting")
            console.error("Error voting:", error);
        }
    };

    return (
        <div className="p-4 bg-white shadow rounded">
            <h2 className="text-lg font-semibold mb-4">Proposals</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vote Count</th>
                        {workflow === 3 && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        )}
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {proposals.map((proposal, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{proposal[0]}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{proposal[1].toString()}</td>
                            {workflow === 3 && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <button
                                        onClick={() => setSelectedProposal(index)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Select
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {workflow === 3 && selectedProposal !== null && (
                <div className="mt-4">
                    <button
                        onClick={handleVote}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Vote
                    </button>
                </div>
            )}
        </div>
    );
}
