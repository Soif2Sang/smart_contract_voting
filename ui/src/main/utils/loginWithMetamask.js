import { ethers } from 'ethers';

export async function loginWithMetamask() {
	if (window.ethereum) {
		const provider = new ethers.BrowserProvider(window.ethereum);
		const accounts = await window.ethereum.request({
			method: 'eth_requestAccounts',
		});

		const selectedAddress = window.ethereum.selectedAddress;

		console.log(accounts);
		console.log(selectedAddress);
		return selectedAddress;
	}
}
