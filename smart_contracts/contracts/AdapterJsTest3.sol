pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract AdapterJsTest3 is ChainlinkClient {
  using Chainlink for Chainlink.Request;

  bytes32 public bytes32Result;
  bool public boolResult;
  uint public uintResult;
  int public intResult;
  bytes public bytesResult;
  string public stringResult;

  constructor() {
    setChainlinkToken(address(0x326C977E6efc84E512bB9C30f76E30c160eD06FB));
  }

  function bytes32AdapterCall(string memory js)
  public returns (bytes32 requestId) {
    Chainlink.Request memory request;
    request = buildChainlinkRequest("b54577060dbc4ea7b37225913c011821", address(this), this.fulfillBytes32.selector);
    request.add("type", "bytes32");
    request.add("js", js);
    return sendChainlinkRequestTo(0xe67382D1FC23E9B2C29de36810D5C8b2Ae021704, request, 1000000000000000000);
  }

  function fulfillBytes32(bytes32 _requestId, bytes32 reply)
  public recordChainlinkFulfillment(_requestId) {
    bytes32Result = reply;
  }

  function uintAdapterCall(string memory js)
  public returns (bytes32 requestId) {
    Chainlink.Request memory request;
    request = buildChainlinkRequest("b54577060dbc4ea7b37225913c011821", address(this), this.fulfillUint.selector);
    request.add("type", "uint");
    request.add("js", js);
    return sendChainlinkRequestTo(0xe67382D1FC23E9B2C29de36810D5C8b2Ae021704, request, 1000000000000000000);
  }

  function fulfillUint(bytes32 _requestId, uint reply)
  public recordChainlinkFulfillment(_requestId) {
    uintResult = reply;
  }

  function intAdapterCall(string memory js)
  public returns (bytes32 requestId) {
    Chainlink.Request memory request;
    request = buildChainlinkRequest("b54577060dbc4ea7b37225913c011821", address(this), this.fulfillInt.selector);
    request.add("type", "int");
    request.add("js", js);
    return sendChainlinkRequestTo(0xe67382D1FC23E9B2C29de36810D5C8b2Ae021704, request, 1000000000000000000);
  }

  function fulfillInt(bytes32 _requestId, int reply)
  public recordChainlinkFulfillment(_requestId) {
    intResult = reply;
  }

  function bytesAdapterCall(string memory js)
  public returns (bytes32 requestId) {
    Chainlink.Request memory request;
    request = buildChainlinkRequest("d1e36dd3ed5d467ea0cef2a2a7dd2991", address(this), this.fulfillBytes.selector);
    request.add("type", "bytes");
    request.add("js", js);
    return sendChainlinkRequestTo(0xe67382D1FC23E9B2C29de36810D5C8b2Ae021704, request, 1000000000000000000);
  }

  function fulfillBytes(bytes32 _requestId, bytes calldata reply)
  public recordChainlinkFulfillment(_requestId) {
    bytesResult = reply;
  }

  function stringAdapterCall(string memory js)
  public returns (bytes32 requestId) {
    Chainlink.Request memory request;
    request = buildChainlinkRequest("d1e36dd3ed5d467ea0cef2a2a7dd2991", address(this), this.fulfillString.selector);
    request.add("type", "string");
    request.add("js", js);
    return sendChainlinkRequestTo(0xe67382D1FC23E9B2C29de36810D5C8b2Ae021704, request, 1000000000000000000);
  }

  function fulfillString(bytes32 _requestId, string calldata reply)
  public recordChainlinkFulfillment(_requestId) {
    stringResult = reply;
  }
}