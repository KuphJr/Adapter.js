
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const oraclefactory = await hre.ethers.getContractFactory("Oracle");
  const oracle = await oraclefactory.attach("0xa8E22A742d39b13D54df6A912FCC7b8E71dFAFE0");
  console.log("oracle deployed to:", oracle.address);
  const reply = await oracle.setFulfillmentPermission(
      ethers.utils.getAddress("0xeb4089122d0040E9A79cc2aE8654fc08D7E80730"),
      true);
  console.log(reply);
  const reply2 = await oracle.getAuthorizationStatus(
    ethers.utils.getAddress("0xeb4089122d0040E9A79cc2aE8654fc08D7E80730"));
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