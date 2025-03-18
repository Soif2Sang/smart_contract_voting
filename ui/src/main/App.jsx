import { ethers } from 'ethers';
import React from 'react';
import { voting } from '../abi/Voting';
import AddProposalForm from './AddProposalForm';
import AddUserForm from './AddUserForm';
import './App.css';
import { address, provider, signer } from './utils/cryptoUtils';

const contract = new ethers.Contract(
	'0x5FbDB2315678afecb367f032d93F642f64180aa3',
	voting.abi,
	signer
);

function App() {
	contract.isOwner().then((result) => console.log(result));

	return (
		<div className="App">
			<header>
				<h1>Cryptobro</h1>
			</header>
			<h2>
				{address
					? `Logged in with the following address : ${address}`
					: 'Metamask not installed !'}
			</h2>
			<AddUserForm></AddUserForm>
			<AddProposalForm></AddProposalForm>
			<br />
			<button>Start proposals</button>
			<button>Close proposals</button>
			<br />
			<button>Start voting</button>
			<button>Close voting</button>
		</div>
	);
}

export default App;
