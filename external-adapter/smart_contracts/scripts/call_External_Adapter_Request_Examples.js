const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {

  // connect to a deployed instance of the smart contract
  const smartContractFactory = await hre.ethers.getContractFactory("External_Adapter_Request_Examples");
  // @TODO: replace the address below with the current address of the deployed smart contract
  // Make sure it is funded with LINK
  const smartContract = await smartContractFactory.attach("0xA566c616782f491c518866f1A759F37Ec6ce0049");

  // set up a listener to print events emitted by the smart contract
  let filter = { address: smartContract.address };
  let provider = new ethers.providers.JsonRpcProvider("https://speedy-nodes-nyc.moralis.io/c13b64136506585cb50319e7/polygon/mumbai");
  const listener = new Promise((resolve, reject) => provider.on(filter, async (event) => {
    if (event.topics.includes('0xb5e6e01e79f91267dc17b4e6314d5d4d03593d2ceee0fbb452b750bd70ea5af9')) {
      console.log("CHAINLINK REQUEST EVENT EMITTED");
    }
    if (event.topics.includes('0x8c2992c05dc87c07311894d1f943111cba4f45bbe1fd66dce65cc5db2c834359')) {
      let int256_result = await smartContract.int256_result();
      console.log("CHAINLINK ORACLE RETURNED INT256:", int256_result.toNumber());
    }
    if (event.topics.includes('0x55cbd3f8c60adc9f7984732c240ea015acf17284b6d83d670ba4ee42b44783ee')) {
      let uint256_result = await smartContract.uint256_result();
      console.log("CHAINLINK ORCALE RETURNED UINT256:", uint256_result.toNumber());
    }
    if (event.topics.includes('0x622c782522db5098e0f79fccd5c2b5b18a9717cdb1eb12934e4b1beb3b255377')) {
      let bool_result = await smartContract.bool_result();
      console.log("CHAINLINK ORCALE RETURNED BOOL:", bool_result);
    }
    if (event.topics.includes('0xdbb7bea395204da325e836f2375f392081152b224349387309f865df9c19ce2c')) {
      let bytes32_result = await smartContract.bytes32_result();
      console.log("CHAINLINK ORCALE RETURNED BYTES32:", ethers.utils.parseBytes32String(bytes32_result));
    }
  }));
  listener;

  // the arguments to an adapter call function are:
  // address of oracle contract, job ID, LINK fee, external adapter parameters
  // await smartContract.int256AdapterCall(
  //   ethers.utils.getAddress("0xa8E22A742d39b13D54df6A912FCC7b8E71dFAFE0"),
  //   "9d8c783d0b9645958697b880fd823137", ethers.BigNumber.from("10").pow(18),
  //   '{"t":"int256","j":"return -8;"}');
  // await smartContract.uint256AdapterCall(
  //   ethers.utils.getAddress("0xa8E22A742d39b13D54df6A912FCC7b8E71dFAFE0"),
  //   "fe689d575d904580b454415399713c01", ethers.BigNumber.from("10").pow(18),
  //   '{"t":"uint256","j":"return 8;"}');
  // await smartContract.boolAdapterCall(
  //   ethers.utils.getAddress("0xa8E22A742d39b13D54df6A912FCC7b8E71dFAFE0"),
  //   "ae5142ab2b6744b7990e4ceb6589b52b", ethers.BigNumber.from("10").pow(18),
  //   '{"t":"bool","j":"return true;"}');
  await smartContract.bytes32AdapterCall(
    ethers.utils.getAddress("0xa8E22A742d39b13D54df6A912FCC7b8E71dFAFE0"),
    "1302aee4e8604b36830c801e613d8082", ethers.BigNumber.from("10").pow(18),
    '{"t":"bytes32","m":"get","u":"https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=elonmusk&count=1","j":"return response.data[0].text.replace(`@`, "AT").slice(0,31)","r":"1234"}');
}

main()
  .then(() => {
    return;
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
