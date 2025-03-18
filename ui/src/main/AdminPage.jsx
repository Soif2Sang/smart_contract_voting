import React from 'react';
import AddUserForm from './AddUserForm';

function AdminPage() {
	return (
		<>
			<AddUserForm></AddUserForm>

			<button>Start proposals</button>
			<button>Close proposals</button>
			<br />
			<button>Start voting</button>
			<button>Close voting</button>
		</>
	);
}

export default AdminPage;
