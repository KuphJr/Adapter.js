console.log(process.env.TESTWALLET);

const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const smartContractFactory = await hre.ethers.getContractFactory("External_Adapter_Request_Examples");
  const smartContract = await SmartContractFactory.deploy(
    ethers.utils.getAddress("0x326C977E6efc84E512bB9C30f76E30c160eD06FB"));

  await smartContract.deployed();

  console.log("Smart contract deployed to:", AdapterJS.address);
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