const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const oraclefactory = await hre.ethers.getContractFactory("Oracle");
  const oracle = await oraclefactory.attach("0xc080F8D8378782d6464166703C306ef0b16471d5");
  // console.log("oracle deployed to:", oracle.address);
  // const reply = await oracle.setFulfillmentPermission(
  //     ethers.utils.getAddress("0x8195A9E6d0EdBf96DfF46Be22B7CcdaBB7F09153"),
  //     true);
  // console.log(reply);
  const reply2 = await oracle.getAuthorizationStatus(
    ethers.utils.getAddress("0x8195A9E6d0EdBf96DfF46Be22B7CcdaBB7F09153"));
  console.log(reply2);
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