const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const oraclefactory = await hre.ethers.getContractFactory("Oracle");
  const oracle = await oraclefactory.attach("0xAC442d76EeC61518D2112eeB67620Cbf05D6f746");
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