import AddProposalForm from './AddProposalForm';
import AddUserForm from './AddUserForm';
import './App.css';

function App() {
	return (
		<div className="App">
			<header>
				<h1>Cryptobro</h1>
			</header>
			<AddUserForm></AddUserForm>
			<AddProposalForm></AddProposalForm>
			<br />
			<button>Start proposals</button>
			<button>Close proposals</button>
			<br />
			<button>Start voting</button>
			<button>Close voting</button>
		</div>
	);
}

export default App;
