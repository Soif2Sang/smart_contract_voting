import { useState } from "react";
import { useContract } from "../../utils/abi/ContractProvider";

export default function AddVoterForm() {
	const { contract, workflow } = useContract();
	const [voterAddress, setVoterAddress] = useState("");

	const handleAddVoter = async () => {
		try {
			const tx = await contract.registerVoter(voterAddress);
			await tx.wait();
			alert(`Voter ${voterAddress} registered successfully!`);
			setVoterAddress("");
		} catch (error) {
			console.error(error);
			alert("Failed to register voter.");
		}
	};

	const isVoterRegistrationOpen = workflow === 0; // Assuming 0 is the "RegisteringVoters" status

	return (
		<div className="p-4 bg-white shadow rounded mb-4">
			<h2 className="text-lg font-semibold mb-4">Add Voter</h2>
			<input
				type="text"
				placeholder="Enter voter address"
				value={voterAddress}
				onChange={(e) => setVoterAddress(e.target.value)}
				className={`border rounded p-2 w-full mb-2 ${isVoterRegistrationOpen ? "" : "opacity-50 cursor-not-allowed"}`}
				disabled={!isVoterRegistrationOpen}
			/>
			<button
				onClick={handleAddVoter}
				className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${isVoterRegistrationOpen ? "" : "opacity-50 cursor-not-allowed"}`}
				disabled={!isVoterRegistrationOpen}
			>
				Add Voter
			</button>
			{!isVoterRegistrationOpen && (
				<p className="text-red-500 mt-2">Voter registration is currently closed.</p>
			)}
		</div>
	);
}
