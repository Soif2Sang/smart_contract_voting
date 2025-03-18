import React from 'react';
import { loginWithMetamask } from './utils/loginWithMetamask';

function MetamaskLoginSection({ address, setAddress }) {
	return (
		<>
			<h2>
				{address
					? `Logged in with the following address : ${address}`
					: 'Metamask not installed !'}
			</h2>
			<button
				onClick={async (event) => {
					event.preventDefault();

					setAddress(await loginWithMetamask());
				}}
			>
				Login with Metamask
			</button>
		</>
	);
}

export default MetamaskLoginSection;
