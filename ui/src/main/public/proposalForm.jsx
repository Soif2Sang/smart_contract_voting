import React, { useState } from 'react';
import { useContract } from "../../abi/ContractProvider";

export default function ProposalForm() {
    const { contract } = useContract();
    const [proposal, setProposal] = useState('');

    const submitProposal = async (e) => {
        e.preventDefault();
        if (!contract) {
            alert('Contract not loaded');
            return;
        }

        try {
            const tx = await contract.registerProposal(proposal);
            await tx.wait(); // Wait for transaction confirmation
            alert('Proposal submitted successfully!');
            setProposal(''); // Clear input field
        } catch (error) {
            console.error('Error submitting proposal:', error);
            alert('Failed to submit proposal.');
        }
    };

    return (
        <div className="p-4 bg-white shadow rounded mb-4">
            <h2 className="text-lg font-semibold mb-4">Proposal Form</h2>
            <form onSubmit={submitProposal} className="space-y-4">
                <textarea
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    placeholder="Enter your proposal here"
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    rows="4"
                />
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
