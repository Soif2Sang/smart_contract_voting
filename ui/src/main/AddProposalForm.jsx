import React, { useState } from 'react';

function AddProposalForm() {
	const [proposalContent, setProposalContent] = useState('');
	const [proposals, setProposals] = useState([]);

	return (
		<>
			<form
				onSubmit={function (event) {
					event.preventDefault();
					console.log(event);

					setProposals(proposals.concat([proposalContent]));
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

			<ul>
				{proposals.map((proposal) => (
					<li key={proposal}>
						<p>{proposal}</p>
						<button
							onClick={function (event) {
								event.preventDefault();
								console.log(event);

								
							}}
						></button>
					</li>
				))}
			</ul>
		</>
	);
}

export default AddProposalForm;
