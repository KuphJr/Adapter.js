const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const oraclefactory = await hre.ethers.getContractFactory("Oracle");
  const oracle = await oraclefactory.deploy(
      ethers.utils.getAddress("0x326C977E6efc84E512bB9C30f76E30c160eD06FB"));

  await oracle.deployed();

  console.log("oracle deployed to:", oracle.address);
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