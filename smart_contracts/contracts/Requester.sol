pragma solidity ^0.8.13;

interface IAdapterJsDirectRequestAggregator {
  function makeRequest(string calldata js, string calldata cid, bytes32 ref, bytes32 type);
}

interface IOfferRegistry {
  function registerOffer(address requester, string calldata javascriptIpfsHash, uint maxOfferValue);
}

contract Requester {
  address owner;
  address aggregator;
  address influencer;
  string javascriptIpfsHash;
  uint expirationTime;
  uint maxOfferValue;

  uint lastBlockFulfillOfferWasCalled;

  /**
    @dev A brand deploys a separate instance of this contract for every brand integration deal
    they want to offer an influencer.
    @param _aggregator The address of the Adapter.js Direct Request Aggregator contract
    @param _registry The address of the registry contract
    @param _influencer The wallet address of the influencer who can accept the offer
    @param _javascriptIpfsHash The content identifer for the JavaScript code that has been uploaded
    to IPFS. This code contains the logic which determines how much an influcer is paid.
    @param _expirationTime The time (in seconds since the UNIX epoch) at which the contract ends
    and the `initateContractCompletion` function can be called.
  */
  payable constructor (
    address _aggregator,
    address _registry,
    address _influencer,
    string calldata _javascriptIpfsHash,
    uint expirationTime,
    address linkTokenContractAddress
  ) {
    owner = msg.sender;
    maxOfferValue = msg.value;
    aggregator = _aggregator;
    influencer = _influencer;
    javascriptIpfsHash = _javascriptIpfsHash;
    expirationTime = _expirationTime;
    IOfferRegistry(maxOfferValue).registerOffer(owner, javascriptIpfsHash, maxOfferValue)
  }

  /**
    @dev This function is called by the influencer to fulfill a brand integration offer and
    initiate the Adapter.js request to calculate and send the amount earned.
    @param _referenceToPrivateVars This is the reference to the private off-chain variables the
    influencer uploaded to the private databases of all the nodes in the Adapter.js DON. These
    private variables will contain the link to the sponsored Tweet to keep the brand integration
    deal anonymous, as well as the API keys required to query the Twitter API.
  */
  function fulfillOffer(
    bytes32 referenceToPrivateVars
  ) {
    // only the influencer who has been sent the contract can accept
    require(msg.sender == influencer, 'Only the specified influencer can accept the offer');
    require(now <= expirationTime, 'The offer has expired');
    // This logic allows a "retry" to fulfill the offer.
    // (If an Adapter.js request isn't fulfilled within 15 blocks, it has failed and will never be
    // fulfilled. This logic is handled in the AdapterJsDirectRequestAggregator contract.)
    require(block.number - lastBlockWhenFulfillOfferWasCalled > 15)
    IAdapterJsDirectRequestAggregator(aggregator)
      .makeRequest('', _javascriptIpfsHash, referenceToPrivateVars)
  }

  /**
    @dev This function is called by the aggregator contract
  */
  function fulfillAdapterJsDirectRequest(uint amountOwedToInfluencer) {
    require(msg.sender == aggregator);
    if (address(this).balance <= amountOwedToInfluencer) {
      address(influencer).transfer(address(this).balance);
      return;
    }
    address(influencer).transfer(amountOwedToInfluencer);
    address(owner).transfer(address(this).balance);
  }

  /**
    @dev If the offer has not been fulfilled before the expiration time,
    the brand can recover their locked funds.
  */
  function recoverFunds() {
    require(now > expirationTime);
    address(owner).transfer(address(this).balance);
  }
}