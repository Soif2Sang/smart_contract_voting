import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { voting } from './Voting';
import { address, metamaskError, signer } from '../main/utils/cryptoUtils';

const ContractContext = createContext(null);

export const ContractProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [contract, setContract] = useState(null);
    const [workflow, setWorkflow] = useState(0);

    const handleWorkflowChange = (previousStatus, newStatus) => {
        const newStatusNumber = Number(newStatus);
        setWorkflow(newStatusNumber);
        console.log('Workflow changed to:', newStatusNumber);
    };

    useEffect(() => {
        async function loadContract() {
            try {
                const contractInstance = new ethers.Contract(
                    '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
                    voting.abi,
                    signer
                );
                setContract(contractInstance);
                const ownerStatus = await contractInstance.isOwner();
                console.log('Owner status:', ownerStatus);
                setIsAdmin(ownerStatus);
            } catch (error) {
                console.error('Error loading contract:', error);
            }
        }
        loadContract();
    }, []);

    useEffect(() => {
        if (!contract) return;

        async function getCurrentWorkflow() {
            try {
                const status = await contract.getWorkflowStatus();
                const nstatus = Number(status);
                setWorkflow(nstatus);
                console.log('Workflow status:', nstatus);
            } catch (error) {
                console.error('Error getting workflow status:', error);
            }
        }
        getCurrentWorkflow();

        contract.on('WorkflowStatusChange', handleWorkflowChange);
        return () => {
            contract.removeListener('WorkflowStatusChange', handleWorkflowChange);
        };
    }, [contract]);


    return (
        <ContractContext.Provider value={{ contract, isAdmin, address, metamaskError, workflow }}>
            {children}
        </ContractContext.Provider>
    );
};

export const useContract = () => useContext(ContractContext);
