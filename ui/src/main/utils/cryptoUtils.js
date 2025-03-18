import { ethers } from 'ethers';

export const provider = new ethers.BrowserProvider(window.ethereum);
export const signer = await provider.getSigner();
export const address = await signer.getAddress();

console.log(provider);
console.log(signer);
console.log(address);
