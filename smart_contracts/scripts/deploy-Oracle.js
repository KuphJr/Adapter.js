const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const oraclefactory = await hre.ethers.getContractFactory("Oracle");
  const oracle = await oraclefactory.deploy(
      ethers.utils.getAddress("0x326C977E6efc84E512bB9C30f76E30c160eD06FB"));

  await oracle.deployed();

  const txHash = oracle.deployTransaction.hash;
  console.log(`Tx hash: ${txHash}\nWaiting for transaction to be mined...`);
  const txReceipt = await ethers.provider.waitForTransaction(txHash);
  console.log("Contract address:", txReceipt.contractAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => {
      return;
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });