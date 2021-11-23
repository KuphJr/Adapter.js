
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    const contractfactory = await hre.ethers.getContractFactory("GeneratedCodeTest");
    const contract = await contractfactory.deploy();

    await contract.deployed();

    console.log("Contract deployed to:", contract.address);
}

main()
  .then(() => {
      return;
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });