import { useState } from "react";
import { useContract } from "../../abi/ContractProvider";
import { ethers } from "ethers";

export default function AddVoterForm() {
	const { contract } = useContract();
	const [voterAddress, setVoterAddress] = useState("");

	const handleAddVoter = async () => {
		try {
			const tx = await contract.registerVoter(voterAddress);
			await tx.wait(); // Wait for the transaction to be confirmed
			alert(`Voter ${voterAddress} registered successfully!`);
			setVoterAddress(""); // Clear the input after successful registration
		} catch (error) {
			console.error(error);
			alert("Failed to register voter.");
		}
	};

	return (
		<div>
			<h2>Add Voter</h2>
			<input
				type="text"
				placeholder="Enter voter address"
				value={voterAddress}
				onChange={(e) => setVoterAddress(e.target.value)}
			/>
			<button onClick={handleAddVoter}>Add Voter</button>
		</div>
	);
}
