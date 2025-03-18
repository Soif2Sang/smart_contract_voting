import React, { useState } from 'react';
import {useContract} from "../../abi/ContractProvider";

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
        <div>
            <h1>Proposal Form</h1>
            <form onSubmit={submitProposal}>
                <textarea
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    placeholder="Enter your proposal here"
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
