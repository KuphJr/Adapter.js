//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract GeneratedCodeTest is ChainlinkClient {
    bytes32 public result;
    event adapterReply(bytes32 reply);

    constructor() {
        setChainlinkToken(address(0x326C977E6efc84E512bB9C30f76E30c160eD06FB));
    }
    using Chainlink for Chainlink.Request;
    function request() public returns (bytes32 requestId) {
    Chainlink.Request memory ea_request = buildChainlinkRequest(
        '1302aee4e8604b36830c801e613d8082', address(this), this.fulfill.selector);
    ea_request.add('p',
        "{\"t\":\"bytes32\",\"m\":\"get\",\"u\":\"https://cointelegraph.com/tags/altcoin\",\"i\":\"bafybeih6xvcuocf673k4w6stkfgcopdhjit3wlp6fndz4x5ej3koflztt4\"}"
    );
    return sendChainlinkRequestTo(
        address(0xa8E22A742d39b13D54df6A912FCC7b8E71dFAFE0),
        ea_request, 1000000000000000000);
    }
    function fulfill(bytes32 _requestId, bytes32 _reply)
    public recordChainlinkFulfillment(_requestId) {
        // add code here that uses the _reply from the external adapter
        result = _reply;
        emit adapterReply(_reply);
    }
}