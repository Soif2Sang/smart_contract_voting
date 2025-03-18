import {useContract} from "../../abi/ContractProvider";
import {useState} from "react";

export default function WorkflowBanner() {
    const {contract} = useContract();
    const [state, setState] = useState(null);

    function getCurrentWorkflow() {
        contract.getWorkflowStatus().then((status) => {
            setState(status);
            console.log('Workflow status:', status)
        }).catch((error) => {
            console.error('Error getting workflow status:', error)
        });
    }

    return <div>
        <h1>Workflow Banner</h1>
        <button onClick={getCurrentWorkflow}>Get Workflow Status</button>
        <p>Current workflow status: {state}</p>
    </div>
}
