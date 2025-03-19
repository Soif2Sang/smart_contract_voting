import { ethers } from 'ethers';

export const metamaskError = window.ethereum ? false : true;
export const provider = new ethers.BrowserProvider(window.ethereum);
export const signer = await provider.getSigner();
export const address = await signer.getAddress();

console.log('metamaskError : ', metamaskError);
console.log('provider : ', provider);
console.log('signer : ', signer);
console.log('address : ', address);
