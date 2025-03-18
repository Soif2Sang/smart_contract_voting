import { ethers } from 'ethers';
import React from 'react';
import { voting } from '../abi/Voting';
import AddProposalForm from './AddProposalForm';
import AdminPage from './AdminPage';
import { address, metamaskError, signer } from './utils/cryptoUtils';

const contract = new ethers.Contract(
	'0x5FbDB2315678afecb367f032d93F642f64180aa3',
	voting.abi,
	signer
);

const isAdmin = await contract.isOwner();

function App() {
	return (
		<div className="App">
			<header>
				<h1>Cryptobro</h1>
			</header>
			<h2>
				{metamaskError
					? 'There was an error with Metamask !'
					: `Logged in with the following address : ${address}${
							isAdmin ? ' (admin)' : ''
					  }`}
			</h2>
			{isAdmin ? <AdminPage></AdminPage> : <></>}
			<br />
			<AddProposalForm></AddProposalForm>
		</div>
	);
}

export default App;
