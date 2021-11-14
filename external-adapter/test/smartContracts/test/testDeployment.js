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
    
    const AdapterJS = await AdapterJSfactory.attach("0xB5c71fa39eCf07621FF1130Fa3819259dCd54c44");

    console.log("AdapterJS attached to:", AdapterJS.address);
    const fee = await AdapterJS.fee();
    console.log("fee: ", fee);
    //const int256JobId = await AdapterJS.int256JobId();
    //console.log("int256JobId: ", int256JobId);
    //const int256JobIdstring = ethers.utils.parseBytes32String(int256JobId);
    //console.log("As string: ", int256JobIdstring);

    let filter = { address: AdapterJS.address };
    let provider = new ethers.providers.JsonRpcProvider("https://speedy-nodes-nyc.moralis.io/c13b64136506585cb50319e7/polygon/mumbai");
    let promise = new Promise((resolve, reject) => provider.on(filter, (event) => {
        console.log("EVENT\n: ", event);
        resolve();
    }));
    promise;

    console.log("BEFORE CL REQ!!!");

    const transaction = await AdapterJS.simpleCallAdapter();
    console.log("CL REQUEST", transaction);
    //const transaction = await AdapterJS.int256CallAdapter(1, "", "", "", "return 5;", "");
    //console.log("CL REQUEST", transaction);
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
