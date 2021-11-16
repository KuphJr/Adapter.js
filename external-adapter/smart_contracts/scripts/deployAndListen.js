// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const AdapterJSfactory = await hre.ethers.getContractFactory("AdapterJS");
  const AdapterJS = await AdapterJSfactory.deploy(ethers.utils.getAddress("0xf5D34A1E76A8514828528b67D6Ba8913823A96cA"), 
    ethers.utils.formatBytes32String("2"), ethers.utils.formatBytes32String("0"),
    ethers.utils.formatBytes32String("0"), ethers.utils.formatBytes32String("0"), 1);

  await AdapterJS.deployed();

  console.log("AdapterJS deployed to:", AdapterJS.address);

  return AdapterJS;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(AdapterJS => {
      console.log("listening: ", AdapterJS.address);
      // AdapterJS.on("deployed", (time) => {
      //   console.log("deployed", time);
      // });
      let filter = { address: AdapterJS.address };
      let provider = new ethers.providers.JsonRpcProvider("https://speedy-nodes-nyc.moralis.io/c13b64136506585cb50319e7/polygon/mumbai");
      provider.on(filter, (event) => console.log("event: ", event));
    }
  )
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });