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
    
    const AdapterJS = await AdapterJSfactory.attach("0x2e330538160F0E106bC2677a9aA66c4044A81DCc");

    let filter = { address: AdapterJS.address };
    let provider = new ethers.providers.JsonRpcProvider("https://speedy-nodes-nyc.moralis.io/c13b64136506585cb50319e7/polygon/mumbai");
    let promise = new Promise((resolve, reject) => provider.on(filter, (event) => {
        console.log("AdapterJS EVENT\n: ", event);
        resolve();
    }));
    promise;
    let filter2 = { address: ethers.utils.getAddress(
        "0xa8E22A742d39b13D54df6A912FCC7b8E71dFAFE0") };
    let promise2 = new Promise((resolve, reject) => provider.on(filter2, (event) => {
        console.log("Oracle Contract EVENT\n: ", event);
        resolve();
    }));
    promise2;

    console.log("AdapterJS attached to:", AdapterJS.address);
    // const tokenAddr = await AdapterJS.chainlinkTokenAddress();
    // console.log("LINK addr: ", tokenAddr);
    const oracleAddr = await AdapterJS.chainlinkNode();
    console.log("oracle Addr: ", oracleAddr);
    //const int256JobId = await AdapterJS.int256JobId();
    //console.log("int256JobId: ", int256JobId);
    //const int256JobIdstring = ethers.utils.parseBytes32String(int256JobId);
    //console.log("As string: ", int256JobIdstring);

    const oraclefactory = await hre.ethers.getContractFactory("Oracle");
    const oracle = await oraclefactory.attach("0xa8E22A742d39b13D54df6A912FCC7b8E71dFAFE0");
    console.log("oracle deployed to:", oracle.address);
    const reply2 = await oracle.getAuthorizationStatus(
      ethers.utils.getAddress("0xeb4089122d0040E9A79cc2aE8654fc08D7E80730"));
    console.log(reply2);

    console.log("BEFORE CL REQ!!!");

    //const transaction = await AdapterJS.requestEthereumPrice(ethers.utils.getAddress(
    //    "0xa8E22A742d39b13D54df6A912FCC7b8E71dFAFE0"), "41d225ff77fe4defaaa57d9769deb0b1", ethers.BigNumber.from("10").pow(18));
    //console.log("CL REQUEST", transaction);
    const transaction = await AdapterJS.int256CallAdapter(ethers.utils.getAddress("0xa8E22A742d39b13D54df6A912FCC7b8E71dFAFE0"),
        "1d1379d6ebe04c12b412d6408827dac6", ethers.BigNumber.from("10").pow(18),
        "", "", "", "", "return 5;", "");
    console.log("CL REQUEST", transaction);
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
