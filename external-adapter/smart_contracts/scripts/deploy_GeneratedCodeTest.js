
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    const contractfactory = await hre.ethers.getContractFactory("GeneratedCodeTest");
    const contract = await contractfactory.deploy();

    await contract.deployed();

    console.log("Contract deployed to:", contract.address);
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