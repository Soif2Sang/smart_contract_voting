import React, { useState } from 'react';
import AddProposalForm from './AddProposalForm';
import AddUserForm from './AddUserForm';
import './App.css';
import MetamaskLoginSection from './MetamaskLoginSection';

function App() {
	const [address, setAddress] = useState('');

	return (
		<div className="App">
			<header>
				<h1>Cryptobro</h1>
			</header>
			<MetamaskLoginSection
				address={address}
				setAddress={setAddress}
			></MetamaskLoginSection>
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
