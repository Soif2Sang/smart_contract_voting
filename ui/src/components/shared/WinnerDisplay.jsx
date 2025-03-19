import { useState, useEffect } from "react";
import { useContract } from "../../utils/abi/ContractProvider";

export default function WinnerDisplay() {
    const [winner, setWinner] = useState(null);
    const { contract, workflow } = useContract();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!contract) return;

        const fetchWinner = async () => {
            setIsLoading(true); // Set loading to true before fetching
            try {
                const [winnerId, proposal] = await contract.getWinner();
                setWinner({ winnerId, proposal });
            } catch (error) {
                console.error("Error fetching winner:", error);
            } finally {
                setIsLoading(false); // Set loading to false after fetching (or error)
            }
        };

        if (workflow === 5) {
            fetchWinner();
        }
    }, [contract, workflow]);

    if (workflow !== 5) {
        return (
            <div className="p-4 bg-white shadow rounded mb-4">
                <h2 className="text-lg font-semibold mb-2">Winner</h2>
                <p className="text-gray-700">Winner will be displayed after votes are tallied.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="p-4 bg-white shadow rounded mb-4">
                <h2 className="text-lg font-semibold mb-2">Winner</h2>
                <p className="text-gray-700">Fetching winner...</p>
            </div>
        );
    }

    if (!winner) {
        return (
            <div className="p-4 bg-white shadow rounded mb-4">
                <h2 className="text-lg font-semibold mb-2">Winner</h2>
                <p className="text-gray-700">Tallying votes...</p>
            </div>
        );
    }

    return (
        <div className="p-4 bg-white shadow rounded mb-4">
            <h2 className="text-lg font-semibold mb-2">Winner</h2>
            <p className="text-green-600 font-semibold">
                The winner is: {winner.proposal || "Unknown Proposal"} ({winner.winnerId?.toString() || "Unknown ID"})
            </p>
        </div>
    );
}
