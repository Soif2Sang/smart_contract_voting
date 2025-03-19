import { useState, useEffect } from "react";
import { useContract } from "../../abi/ContractProvider";

export default function VoterList() {
    const [voters, setVoters] = useState([]);
    const { contract } = useContract();

    useEffect(() => {
        if (!contract) return;

        async function fetchVoters() {
            try {
                // Call the contract method to get whitelisted voters.
                // getWhitelistedVoters returns a tuple: ([addresses], [voterInfos])
                const [addresses, voterInfos] = await contract.getWhitelistedVoters();

                console.log("Addresses:", addresses);
                console.log("Voter infos:", voterInfos);

                // Format the fetched data into an array of voter objects.
                const formattedVoters = addresses.map((address, index) => ({
                    address,
                    isRegistered: voterInfos[index].isRegistered,
                    hasVoted: voterInfos[index].hasVoted,
                    // Convert votedProposalId to a string if it is a BigNumber.
                    votedProposalId: voterInfos[index].votedProposalId.toString(),
                }));

                setVoters(formattedVoters);
            } catch (error) {
                console.error("Error fetching voters:", error);
            }
        }

        fetchVoters();

        contract.addListener("VoterRegistered", (voterAddress) => {
            console.log(`Voter registered: ${voterAddress}`);
            fetchVoters();
        });
    }, [contract]);

    return (
        <div>
            <h2>Registered Voters</h2>
            <ul>
                {voters.map((voter, index) => (
                    <li key={index}>
                        <p><strong>Address:</strong> {voter.address}</p>
                        <p><strong>Registered:</strong> {voter.isRegistered.toString()}</p>
                        <p><strong>Voted:</strong> {voter.hasVoted.toString()}</p>
                        <p><strong>Voted Proposal ID:</strong> {voter.votedProposalId}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
