const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const smartContractFactory = await hre.ethers.getContractFactory("AdapterjsTest");
  const smartContract = await smartContractFactory.deploy(
    ethers.utils.getAddress("0x326C977E6efc84E512bB9C30f76E30c160eD06FB"));

  const deployed = await smartContract.deployed();

  console.log(deployed);

  console.log("Smart contract deployed to:", smartContract.address);
}

main()
  .then(() => {
      return;
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });