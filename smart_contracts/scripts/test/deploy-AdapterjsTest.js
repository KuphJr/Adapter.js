const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const smartContractFactory = await hre.ethers.getContractFactory("AdapterjsTest2");
  const smartContract = await smartContractFactory.deploy(ethers.utils.getAddress("0x326C977E6efc84E512bB9C30f76E30c160eD06FB"));

  const deployed = await smartContract.deployed();

  const txHash = smartContract.deployTransaction.hash;
  console.log(`Tx hash: ${txHash}\nWaiting for transaction to be mined...`);
  const txReceipt = await ethers.provider.waitForTransaction(txHash);
  console.log("Contract address:", txReceipt.contractAddress);
}

main()
  .then(() => {
      return;
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });