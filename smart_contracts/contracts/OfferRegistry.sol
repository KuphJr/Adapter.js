// must require that a registering contract has the proper ABI

bytes32 codeHash;
assembly { codeHash := extcodehash(newOfferAddress) };
require(codeHash == requesterContractHash);