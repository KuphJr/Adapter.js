const hre = require("hardhat");

async function main() {
  const Operator = await hre.ethers.getContractFactory("Operator");
  const operator = await Operator.deploy("0x01BE23585060835E02B77ef475b0Cc51aA1e0709", "0xB7aB5555BB8927BF16F8496da338a3033c12F8f3");

  console.log(`Tx hash: ${txHash}\nWaiting for transaction to be mined...`);
  await operator.deployed();

  
  const txHash = operator.deployTransaction.hash;
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