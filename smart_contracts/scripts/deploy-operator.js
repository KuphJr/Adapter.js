const hre = require("hardhat");

async function main() {
  const Operator = await hre.ethers.getContractFactory("Operator");
  const operator = await Operator.deploy(
    ethers.utils.getAddress("0x326C977E6efc84E512bB9C30f76E30c160eD06FB"),
    ethers.utils.getAddress("0xB7aB5555BB8927BF16F8496da338a3033c12F8f3")
  );

  await operator.deployed();

  const txHash = operator.deployTransaction.hash;
  console.log(`Waiting for transaction to be mined...`);
  const txReceipt = await ethers.provider.waitForTransaction(txHash);
  console.log("Operator contract deployed to:", txReceipt.contractAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });