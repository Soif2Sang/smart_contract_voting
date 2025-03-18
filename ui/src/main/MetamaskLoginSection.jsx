import { ethers } from 'ethers';
import React, { useState } from 'react';

async function loginWithMetamask() {
	if (window.ethereum) {
		const provider = new ethers.BrowserProvider(window.ethereum);
		const accounts = await window.ethereum.request({
			method: 'eth_requestAccounts',
		});

		const selectedAddress = window.ethereum.selectedAddress;

		console.log(accounts);
		console.log(selectedAddress);
		return `Logged in with the following address : ${selectedAddress}`;
	} else {
		return 'Metamask not installed !';
	}
}
function MetamaskLoginSection() {
	const [status, setStatus] = useState('');
	return (
		<>
			<h2>{status}</h2>
			<button
				onClick={(event) => {
					event.preventDefault();

					setStatus(loginWithMetamask());
				}}
			>
				Login with Metamask
			</button>
		</>
	);
}

export default MetamaskLoginSection;
