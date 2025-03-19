// VoterList.js
import { useState, useEffect } from "react";
import { useContract } from "../../utils/abi/ContractProvider";

export default function VoterList() {
    const [voters, setVoters] = useState([]);
    const { contract } = useContract();

    useEffect(() => {
        if (!contract) return;

        async function fetchVoters() {
            try {
                const [addresses, voterInfos] = await contract.getWhitelistedVoters();

                const formattedVoters = addresses.map((address, index) => ({
                    address,
                    isRegistered: voterInfos[index].isRegistered,
                    hasVoted: voterInfos[index].hasVoted,
                    votedProposalId: voterInfos[index].votedProposalId.toString(),
                }));

                setVoters(formattedVoters);
            } catch (error) {
                console.error("Error fetching voters:", error);
            }
        }

        fetchVoters();

        const voterRegisteredListener = (voterAddress) => {
            fetchVoters();
        };

        contract.on("VoterRegistered", voterRegisteredListener);
        contract.addListener("VoterRegistered", voterRegisteredListener);

        return () => {
            contract.removeListener("VoterRegistered", voterRegisteredListener);
        };
    }, [contract]);

    return (
        <div className="p-4 bg-white shadow rounded mb-4">
            <h2 className="text-lg font-semibold mb-4">Registered Voters</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voted</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voted Proposal ID</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {voters.map((voter, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{voter.address}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{voter.isRegistered.toString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{voter.hasVoted.toString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{voter.hasVoted && voter.votedProposalId}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
