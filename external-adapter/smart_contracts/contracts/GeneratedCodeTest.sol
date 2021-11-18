//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract GeneratedCodeTest is ChainlinkClient {
    int256 public result = 0;
    event adapterReply(int256 reply);

  constructor() {
    setChainlinkToken(address(0x326C977E6efc84E512bB9C30f76E30c160eD06FB));
  }

    using Chainlink for Chainlink.Request;
    function request() public returns (bytes32 requestId) {
    Chainlink.Request memory ea_request = buildChainlinkRequest(
        '9d8c783d0b9645958697b880fd823137', address(this), this.fulfill.selector);
    ea_request.add('p',
        '{"t":"int256","m":"get","u":"http://www.randomnumberapi.com/api/v1.0/random?min=100&max=1000&count=1","j":"return response.data[0];"}'
    );
    return sendChainlinkRequestTo(
        address(0xa8E22A742d39b13D54df6A912FCC7b8E71dFAFE0),
        ea_request, 1000000000000000000);
    }
    function fulfill(bytes32 _requestId, int256 _reply)
    public recordChainlinkFulfillment(_requestId) {
        result = _reply;
        emit adapterReply(_reply);
    }
}