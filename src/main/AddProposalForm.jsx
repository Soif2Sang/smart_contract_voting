import React, { useState } from 'react';

function AddProposalForm() {
	const [proposalContent, setProposalContent] = useState('');

	return (
		<>
			<form
				onSubmit={function (event) {
					event.preventDefault();
					console.log(event);

					// TODO handle submit
				}}
			>
				<label>Write your proposal : </label>
				<br />
				<textarea
					type="text"
					onChange={(event) => setProposalContent(event.target.value)}
				></textarea>
				<br />
				<input type="submit" value="Submit proposal">
					{/* Submit : */}
				</input>
			</form>
		</>
	);
}

export default AddProposalForm;
