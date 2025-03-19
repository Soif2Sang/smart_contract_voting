import React, { useState, useEffect } from "react";
import { useContract } from "../../utils/abi/ContractProvider";

export default function ProposalList() {
    const [proposals, setProposals] = useState([]);
    const { contract, workflow } = useContract();
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [loading, setLoading] = useState(false); // Add loading state
    const [error, setError] = useState(null);

    const fetchProposals = async () => {
        if (!contract) return;
        setLoading(true);
        setError(null);
        try {
            const fetchedProposals = await contract.getAllProposals();
            // Important: Check if fetchedProposals is valid and has the expected structure
            console.log('fetchedProposals', fetchedProposals);
            setProposals(Array.from(fetchedProposals));
        } catch (err) {
            console.error("Error fetching proposals:", err);
            setError(err.message || "Failed to fetch proposals. Please check the console for details.");
            setProposals([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!contract) return;

        fetchProposals(); // Initial fetch

        const proposalRegisteredListener = () => {
            console.log("ProposalRegistered event triggered, fetching proposals...");
            fetchProposals();
        };

        const votedListener = () => {
            console.log("Voted event triggered, fetching proposals...");
            fetchProposals();
        };

        // Use .on instead of .addListener, and store the listeners for proper unsubscription
        contract.on("ProposalRegistered", proposalRegisteredListener);
        contract.addListener("ProposalRegistered", proposalRegisteredListener);
        contract.on("Voted", votedListener);
        contract.addListener("Voted", votedListener);

        return () => {
            // Use .off to remove listeners
            contract.off("ProposalRegistered", proposalRegisteredListener);
            contract.off("Voted", votedListener);
        };
    }, [contract]);

    const handleVote = async () => {
        if (!contract || selectedProposal === null) return;
        setLoading(true);
        setError(null);
        try {
            await contract.vote(selectedProposal);
            console.log(`Voted for proposal ${selectedProposal}`);
        } catch (err) {
            console.error("Error voting:", err);
            setError(err.message || "Failed to vote. Please check the console for details.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-4 bg-white shadow rounded">Loading proposals...</div>;
    }

    if (error) {
        return (
            <div className="p-4 bg-white shadow rounded text-red-500">
                Error: {error}
            </div>
        );
    }

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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{proposal[1]?.toString() || "0"}</td>
                            {/* proposal[1] could be undefined, handle it safely */}
                            {workflow === 3 && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <button
                                        onClick={() => setSelectedProposal(index)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        disabled={loading} // Disable button while loading
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
                        disabled={loading} // Disable button while loading
                    >
                        Vote
                    </button>
                </div>
            )}
        </div>
    );
}
