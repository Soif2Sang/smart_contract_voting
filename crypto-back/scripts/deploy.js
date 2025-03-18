const hre = require("hardhat");

async function main() {
	const ownerAddress = '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199';
	const Voting = await hre.ethers.getContractFactory("Voting");
	const voting = await Voting.deploy('0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199');

	await voting.waitForDeployment();

	console.log("Voting deployed to : " + await voting.getAddress() + " with owner : " + ownerAddress);
}


main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});