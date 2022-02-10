pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract BoolTest is ChainlinkClient {
  using Chainlink for Chainlink.Request;

  bool public bool_result;

  constructor() {
    setChainlinkToken(address(0x326C977E6efc84E512bB9C30f76E30c160eD06FB));
  }

  function getInt() public pure returns (int256 num) {
    return 42;
  }

  function boolAdapterCall(address _oracle, string memory _jobId, uint _payment,
    string memory _type, string memory _js, string memory _vars, string memory _cid, string memory _ref)
    public returns (bytes32 requestId) {
      Chainlink.Request memory request;
      request = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfillBool.selector);
      request.add("type", _type);
      if (bytes(_js).length != 0) {
        request.add("js", _js);
      }
      if (bytes(_vars).length != 0) {
        request.add("vars", _vars);
      }
      if (bytes(_cid).length != 0) {
        request.add("cid", _cid);
      }
      if (bytes(_ref).length != 0) {
        request.add("ref", _ref);
      }
      return sendChainlinkRequestTo(_oracle, request, _payment);
  }

  function boolAdapterCall2(address _oracle, string memory _jobId, uint _payment,
    string memory _type, string memory _js, string memory _vars, string memory _cid, string memory _ref)
    public returns (bytes32 requestId) {
      Chainlink.Request memory request;
      request = buildChainlinkRequest("227ca4eae6ac4654bc8b749ba034458b", address(this), this.fulfillBool.selector);
      request.add("type", _type);
      if (bytes(_js).length != 0) {
        request.add("js", _js);
      }
      if (bytes(_vars).length != 0) {
        request.add("vars", _vars);
      }
      if (bytes(_cid).length != 0) {
        request.add("cid", _cid);
      }
      if (bytes(_ref).length != 0) {
        request.add("ref", _ref);
      }
      return sendChainlinkRequestTo(_oracle, request, _payment);
  }

  function setBool(bool _newValue) public {
    bool_result = _newValue;
  }

  function fulfillBool(bytes32 _requestId, bool _reply)
      public recordChainlinkFulfillment(_requestId) {
        bool_result = _reply;
  }

  function stringToBytes32(string memory source) public pure returns (bytes32 result) {
      bytes memory tempEmptyStringTest = bytes(source);
      if (tempEmptyStringTest.length == 0) {
          return 0x0;
      }
      assembly {
          result := mload(add(source, 32))
      }
  }
}