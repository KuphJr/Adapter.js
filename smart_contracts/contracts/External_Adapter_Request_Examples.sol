//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract External_Adapter_Request_Examples is ChainlinkClient {
  using Chainlink for Chainlink.Request;

  event int256AdapterReply(string name, int256 reply);
  event uint256AdapterReply(string name, uint256 reply);
  event boolAdapterReply(string name, bool reply);
  event bytes32AdapterReply(string name, bytes32 reply);

  int256 public int256_result;
  uint256 public uint256_result;
  bool public bool_result;
  bytes32 public bytes32_result;

  constructor(address linkContractAddress) {
    setChainlinkToken(linkContractAddress);
  }

  function int256AdapterCall(
    address _oracle, string calldata _jobId, uint256 _payment,
    string calldata _requestParams)
    public returns (bytes32 requestId) {
          Chainlink.Request memory request;
          request = buildChainlinkRequest(stringToBytes32(_jobId),
                                          address(this),
                                          this.fulfillInt256.selector);
          request.add("p", _requestParams);
          return sendChainlinkRequestTo(_oracle, request, _payment);
  }

  function uint256AdapterCall(
    address _oracle, string calldata _jobId, uint256 _payment,
    string calldata _requestParams)
    public returns (bytes32 requestId) {
          Chainlink.Request memory request;
          request = buildChainlinkRequest(stringToBytes32(_jobId),
                                          address(this),
                                          this.fulfillUint256.selector);
          request.add("p", _requestParams);
          return sendChainlinkRequestTo(_oracle, request, _payment);
  }

  function boolAdapterCall(
    address _oracle, string calldata _jobId, uint256 _payment,
    string calldata _requestParams)
    public returns (bytes32 requestId) {
          Chainlink.Request memory request;
          request = buildChainlinkRequest(stringToBytes32(_jobId),
                                          address(this),
                                          this.fulfillBool.selector);
          request.add("p", _requestParams);
          return sendChainlinkRequestTo(_oracle, request, _payment);
  }

  function bytes32AdapterCall(
    address _oracle, string calldata _jobId, uint256 _payment,
    string calldata _requestParams)
    public returns (bytes32 requestId) {
          Chainlink.Request memory request;
          request = buildChainlinkRequest(stringToBytes32(_jobId),
                                          address(this),
                                          this.fulfillBytes32.selector);
          request.add("p", _requestParams);
          return sendChainlinkRequestTo(_oracle, request, _payment);
  }

  function fulfillInt256(bytes32 _requestId, int256 _reply)
      public recordChainlinkFulfillment(_requestId) {
        int256_result = _reply;
        emit int256AdapterReply("Chainlink node returned an int256", _reply);
  }

  function fulfillUint256(bytes32 _requestId, uint256 _reply)
      public recordChainlinkFulfillment(_requestId) {
        uint256_result = _reply;
        emit uint256AdapterReply("Chainlink node returned a uint256", _reply);
  }

  function fulfillBool(bytes32 _requestId, bool _reply)
      public recordChainlinkFulfillment(_requestId) {
        bool_result = _reply;
        emit boolAdapterReply("Chainlink node returned a bool", _reply);
  }

  function fulfillBytes32(bytes32 _requestId, bytes32 _reply)
      public recordChainlinkFulfillment(_requestId) {
        bytes32_result = _reply;
        emit bytes32AdapterReply("Chainlink node returned bytes32", _reply);
  }

  function stringToBytes32(string memory source)
    private pure returns (bytes32 result) {
      bytes memory tempEmptyStringTest = bytes(source);
      if (tempEmptyStringTest.length == 0) {
        return 0x0;
      }

      assembly { // solhint-disable-line no-inline-assembly
        result := mload(add(source, 32))
      }
  }
}
