# [Adapter.js](https://adapterjs.link/)

<img src="Adapterjs.png" alt="Adapter.js" width="200"/>

**A Chainlink external adapter for securely executing custom JavaScript**

## Overview

[Watch the project overview on YouTube](https://youtu.be/V_P_IAfr22I)
**Pleas note, significant changes and updates have been made in v0.2.0 since this video was made.**

### Problem

Chainlink external adapters are extremely powerful, but have some limitations.

Setting up an external adapter is time consuming.  Developers must first create and host the adapter, then either operate a Chainlink node themselves, or get another node operator to create a  new bridge and job for the adapter.

Additionally, for data received from an external adapter to be truly decentralized, separate instances of the adapter must be hosted on multiple independent Chainlink nodes.  This requires smart contract developers to contact many node operators each time they want to create an external adapter with new functionality and achieve decentralization.

### Solution

Adapter.js seeks to solve the problems currently facing external adapters by becoming the universal external adapter.  Adapter.js can securely execute user-provided Node.js code.  This means it can fetch data from any API or website, even performing multiple HTTP requests simultaneously, and perform any off-chain computation.  In a Chainlink request, users can provide custom code as a string, use a JavaScript file hosted on IPFS or use private JavaScript code uploaded to the external adapter's database.

In addition, Adapter.js can securely store private variables which can be referenced when the user-provided JavaScript code is executed.  Users can securely share private variables or propriety JavaScript code with the external adapter prior to making an on-chain request.  This allows users to maintain privacy for proprietary JavaScript code, API keys or other sensitive data as they are only shared with the external adapter and never exposed on-chain.  The code and variables are cached in the external adapter's database and are only able to be used in requests initiated by authorized smart contract addresses.  This is achieved by including a reference ID in the on-chain request which refers to the cached private data.  The Chainlink node then verifies the contract address that initiated the request and the external adapter fetches the referenced private data for the smart contract and executes the request.

Adapter.js is open source and is being developed such that any Chainlink node operator can run their own independent instance of the external adapter on any function-as-a-service (FaaS) platform.  To achieve decentralization, smart contract developers can then make requests to many nodes which host an instance of the adapter.  Consensus can be reached on-chain by comparing the resulting data provided by each node.

## How to Use

**The simulator is not currently operational as it is being updated to accommodate v0.2.0.**

Use the tool at [adapterjs.link/simulator.html](https://adapterjs.link/simulator.html) to simulate making a request to the external adapter.  Then, click *"Generate Code"* to automatically generate the required Solidity code to make the Chainlink request on-chain.  Swap out the Chainlink oracle address and job id to send the request to a different Chainlink node which hosts Adapter.js.  Check out [adapterjs.link/documentation.html](https://adapterjs.link/documentation.html) for more in-depth documentation about working with Adapter.js

## Current Status

Adapter.js v0.2.0 is currently hosted on an independent Chainlink node for the Mumbai Polygon testnet.  However, any Chainlink node operator can host the external adapter themselves for any Chainlink-supported blockchain.  As more node operators host Adapter.js, this list will be updated.

### **Blockchain:** Mumbai

**Oracle Address:** 0xAC442d76EeC61518D2112eeB67620Cbf05D6f746
- **Job ID for returning uint256:** 565a9e4dfc924a4e90259ee137395d29
- **Job ID for job returning int256:** b8cf82ffef404bfea9714f4dcf5b3ab3
- **Job ID for job returning bool:** fc6aa15e389e469cbf70dfa01b19b330
- **Job ID for job returning bytes32:** 32c633b7958f41c197a11621c2425ba5

**Operator Address:** Coming soon!
- **Job ID for job returning string:** Coming soon!
- **Job ID for job returning bytes:** Coming soon!

## Contact

For suggestions and support, please check out the [Adapter.js Discord community!](https://discord.com/invite/jpGx9tMRWa)
