
require("@nomiclabs/hardhat-waffle");
require('dotenv').config()

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.6.6"
      },
      {
        version: "0.7.0"
      },
      {
        version: "0.8.9"
      }
    ]
  },
  defaultNetwork: "mumbai",
  networks: {
    mumbai: {
        url: "https://dry-young-sun.matic-testnet.quiknode.pro/f0d9ee2313cc5813ca36460677985e066497f634/",

        // Defined in .env file in the root directory, should contain private key for Metamask test wallet with mumbai testnet LINK and MATIC
        accounts: [process.env.WALLETKEY],
    }
  }
};
