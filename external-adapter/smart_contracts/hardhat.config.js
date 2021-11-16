require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.4"
      },
      {
        version: "0.8.7"
      },
      {
        version: "0.6.6"
      }
    ]
  },
  defaultNetwork: "mumbai",
  networks: {
    // Uncomment this block if you want to use the built in hardhat local blockchain
    /* hardhat: {  
        chainId: 91,
        mining: {
          auto: true,
        }
    }, */
    hardhat: {    // This block makes running "npx hardhat node" start a node running a fork of the mumbai testnet
        forking: {
            url: "https://speedy-nodes-nyc.moralis.io/c13b64136506585cb50319e7/polygon/mumbai",
            accounts: ["9dd71b9bd2d22c57fbd48754fd7ac45af1fafb70f5335fefeb29249bc32abd67"]
        }
    },
    // To deploy onto the Matic Mainnet run "npx hardhat run --network matic scripts/deploy.js"
    mumbai: {
        url: "https://speedy-nodes-nyc.moralis.io/c13b64136506585cb50319e7/polygon/mumbai",

        // Defined in .env file in the root directory, should contain private key for Metamask test wallet with mumbai testnet LINK and MATIC
        accounts: ["9dd71b9bd2d22c57fbd48754fd7ac45af1fafb70f5335fefeb29249bc32abd67", "ff657ba65ce2e9c49ae13b325e810cc915abb1a1b99070348f78071f3543ca11"],
    },
    // To deploy onto the Matic Mainnet run "npx hardhat run --network matic scripts/deploy.js"
    matic: {
        url: "https://polygon-mainnet.g.alchemy.com/v2/3CvfKc0qHgxMqJip5RpSdGe9Zxtno8ul",

        // Defined in .env file in the root directory, should contain private key for Metamask test wallet with mumbai testnet LINK and MATIC
        accounts: ["9dd71b9bd2d22c57fbd48754fd7ac45af1fafb70f5335fefeb29249bc32abd67"]
    },
},
};
