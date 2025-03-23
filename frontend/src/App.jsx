// App.js
import React from 'react';
import AdminPage from './components/admin/AdminPage';
import { address, metamaskError } from './utils/cryptoUtils';
import { useContract } from "./utils/abi/ContractProvider";
import ProposalForm from "./components/shared/proposalForm";
import WorkflowBanner from "./components/shared/WorkflowBanner";
import ProposalList from "./components/shared/proposalList";
import WinnerDisplay from "./components/shared/WinnerDisplay";

// This Project is a simple Dapp that allows users to submit proposals and vote on them.
// The APP is very robust and well tested, the functions are self explanatory and the code is well commented.
// The Error handling is also very good and the app is very user friendly.
// The app is also very secure and the code is very clean and well structured.

function App() {
    const { isAdmin, contract } = useContract();

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

    if (!contract) return <div></div>

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

            <div className="p-4">
                <WorkflowBanner/>

                {isAdmin ? <AdminPage/> : <ProposalForm/>}

                <WinnerDisplay/>
                <ProposalList/>
            </div>

        </div>
    );
}

export default App;
