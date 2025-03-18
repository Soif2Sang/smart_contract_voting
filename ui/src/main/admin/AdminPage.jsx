import React from 'react';
import AddUserForm from './AddUserForm';
import ChangeWorkflow from "./WorkflowChange";

function AdminPage() {
	return (
		<>
			<AddUserForm></AddUserForm>
			<ChangeWorkflow/>
		</>
	);
}

export default AdminPage;
