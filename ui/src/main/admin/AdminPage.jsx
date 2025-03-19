// AdminPage.js
import React from 'react';
import AddUserForm from './AddUserForm';
import ChangeWorkflow from "./WorkflowChange";
import VoterList from "../shared/voterList";
import TransferOwnershipForm from "./TransferOwnershipForm";

function AdminPage() {
	return (
		<>
			<TransferOwnershipForm/>
			<ChangeWorkflow />
			<AddUserForm />
			<VoterList />
		</>
	);
}

export default AdminPage;
