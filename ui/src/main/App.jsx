// App.js
import React from 'react';
import AdminPage from './admin/AdminPage';
import { address, metamaskError } from './utils/cryptoUtils';
import { useContract } from "../abi/ContractProvider";
import ProposalForm from "./public/proposalForm";
import WorkflowBanner from "./shared/WorkflowBanner";
import ProposalList from "./public/proposalList";
import WinnerDisplay from "./shared/WinnerDisplay";

function App() {
    const { isAdmin } = useContract();

    if (metamaskError) {
        return (
            <div className="min-h-screen bg-gray-100">
                <header className="bg-blue-500 p-4 text-white text-center">
                    <h1 className="text-2xl font-bold">CryptoScammers</h1>
                </header>
                <div className="p-4 text-center">
                    <h2 className="text-red-600">There was an error with Metamask!</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-blue-500 p-4 text-white text-center">
                <h1 className="text-2xl font-bold">CryptoScammers</h1>
            </header>
            <div className="p-4 text-center">
                <h2 className="text-lg">
                    Logged in with the following address: {address} {isAdmin ?
                    <span className="text-green-600">(admin)</span> : ''}
                </h2>
            </div>
            <WorkflowBanner/>

            <div className="p-4">

                {isAdmin ? <AdminPage/> : <ProposalForm/>}

                <WinnerDisplay/>
                <ProposalList/>
            </div>

        </div>
    );
}

export default App;
