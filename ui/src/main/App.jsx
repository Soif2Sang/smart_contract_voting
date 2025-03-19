import React from 'react';
import AdminPage from './admin/AdminPage';
import {address, metamaskError} from './utils/cryptoUtils';
import {useContract} from "../abi/ContractProvider";
import ProposalForm from "./public/proposalForm";
import WorkflowBanner from "./shared/WorkflowBanner";
import VoterList from "./shared/voterList";
import ProposalList from "./public/proposalList";

function App() {
    const {isAdmin} = useContract();

    if (metamaskError) {
        return (<div className="App">
                <header>
                    <h1>Cryptobro</h1>
                </header>
                <h2>There was an error with Metamask !</h2>
            </div>);
    }

    return (<div className="App">
            <header>
                <h1>Cryptobro</h1>
            </header>
            <h2>
                Logged in with the following address : {address} {isAdmin ? ' (admin)' : ''}
            </h2>
            <WorkflowBanner/>

            {isAdmin ? <AdminPage/>: <ProposalForm/>}

            <ProposalList/>
        </div>);
}

export default App;
