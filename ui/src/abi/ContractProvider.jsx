import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { voting } from './Voting';
import { address, metamaskError, signer } from '../main/utils/cryptoUtils';

const ContractContext = createContext(null);

export const ContractProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [contract, setContract] = useState(null);

    useEffect(() => {
        const loadContract = async () => {
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
        };
        loadContract();
    }, []);

    return (
        <ContractContext.Provider value={{ contract, isAdmin, address, metamaskError }}>
            {children}
        </ContractContext.Provider>
    );
};

export const useContract = () => useContext(ContractContext);
