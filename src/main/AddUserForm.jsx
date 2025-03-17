import React, { useState } from 'react';

function AddUserForm() {
	const [address, setAddress] = useState('');
	const [addresses, setAddresses] = useState([]);

	function addAddress(event) {
		event.preventDefault();
		console.log(event);

		if (!addresses.find((a) => a === address)) {
			const newAddresses = addresses.concat([address]);
			setAddresses(newAddresses);
		}
	}

	return (
		<>
			<form onSubmit={addAddress}>
				<label>New voter's address : {address}</label>
				<br />
				<input
					type="text"
					onChange={(event) => setAddress(event.target.value)}
				></input>
			</form>

			<ul>
				{addresses.map((address) => (
					<li key={address}>
						<p>{address}</p>
					</li>
				))}
			</ul>
		</>
	);
}

export default AddUserForm;
