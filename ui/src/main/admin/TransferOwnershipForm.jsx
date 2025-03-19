import React, { useState } from "react";
import { useContract } from "../../abi/ContractProvider";

export default function TransferOwnershipForm() {
    const { contract, isAdmin } = useContract();
    const [newOwnerAddress, setNewOwnerAddress] = useState("");
    const [isTransferring, setIsTransferring] = useState(false);
    const [transferError, setTransferError] = useState(null);

    const handleTransferOwnership = async () => {
        if (!contract) return;

        setIsTransferring(true);
        setTransferError(null);

        try {
            const tx = await contract.transferOwnership(newOwnerAddress);
            await tx.wait();
            alert(`Ownership transferred to ${newOwnerAddress} successfully!`);
            setNewOwnerAddress("");
        } catch (error) {
            console.error("Error transferring ownership:", error);
            setTransferError(error.message || "Failed to transfer ownership.");
        } finally {
            setIsTransferring(false);
            window.location.reload();
        }
    };

    return (
        <div className="p-4 bg-white shadow rounded mb-4">
            <h2 className="text-lg font-semibold mb-4">Transfer Ownership</h2>
            <input
                type="text"
                placeholder="Enter new owner address"
                value={newOwnerAddress}
                onChange={(e) => setNewOwnerAddress(e.target.value)}
                className={`border rounded p-2 w-full mb-2 ${
                    !isAdmin ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isTransferring}
            />
            <button
                onClick={handleTransferOwnership}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                    isTransferring ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isTransferring}
            >
                {isTransferring ? "Transferring..." : "Transfer Ownership"}
            </button>
            {transferError && <p className="text-red-500 mt-2">{transferError}</p>}
        </div>
    );
}
