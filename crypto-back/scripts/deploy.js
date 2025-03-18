const hre = require("hardhat");

async function main() {
	const [owner] = await hre.ethers.getSigners();
	const Voting = await hre.ethers.getContractFactory("Voting");
	const voting = await Voting.deploy(owner.address);

	await voting.waitForDeployment();

	console.log("Voting deployed to : " + await voting.getAddress() + " with owner : " + owner.address);
}


main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});