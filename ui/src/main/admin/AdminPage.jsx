import React from 'react';
import AddUserForm from './AddUserForm';
import ChangeWorkflow from "./WorkflowChange";
import VoterList from "../shared/voterList";

function AdminPage() {
	return (
		<>
			<ChangeWorkflow/>
			<AddUserForm/>
			<VoterList/>
		</>
	);
}

export default AdminPage;
