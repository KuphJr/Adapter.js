//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract AdapterjsTest is ChainlinkClient {
  using Chainlink for Chainlink.Request;

  event intAdapterReply(string indexed name, int indexed reply);
  event uintAdapterReply(string indexed name, uint indexed reply);
  event boolAdapterReply(string indexed name, bool indexed reply);
  event bytes32AdapterReply(string indexed name, bytes32 indexed reply);
  event stringAdapterReply(string indexed name, string indexed reply);
  event bytesAdapterReply(string indexed name, bytes indexed reply);

  bool public bool_result;
  uint public uint_result;
  int public int_result;
  bytes32 public bytes32_result;
  string public string_result;
  bytes public bytes_result;
  string public js;

  constructor() {
    setChainlinkToken(address(0x326C977E6efc84E512bB9C30f76E30c160eD06FB));
  }

  function getInt() public view returns (int256 num) {
    return 6;
  }

  function boolAdapterCall(address _oracle, string memory _jobId, uint _payment,
    string memory _js, string memory _vars, string memory _cid, string memory _ref)
    public returns (bytes32 requestId) {
      Chainlink.Request memory request;
      request = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfillBool.selector);
      js = _js;
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

  function uintAdapterCall(address _oracle, string memory _jobId, uint _payment,
    string memory _js, string memory _vars, string memory _cid, string memory _ref)
    public returns (bytes32 requestId) {
      Chainlink.Request memory request;
      request = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfillUint.selector);
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

  function intAdapterCall(address _oracle, string memory _jobId, uint _payment,
    string memory _js, string memory _vars, string memory _cid, string memory _ref)
    public returns (bytes32 requestId) {
      Chainlink.Request memory request;
      request = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfillInt.selector);
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

  function bytes32AdapterCall(address _oracle, string memory _jobId, uint _payment,
    string memory _js, string memory _vars, string memory _cid, string memory _ref)
    public returns (bytes32 requestId) {
      Chainlink.Request memory request;
      request = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfillBytes32.selector);
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

  function stringAdapterCall(address _oracle, string memory _jobId, uint _payment,
    string memory _js, string memory _vars, string memory _cid, string memory _ref)
    public returns (bytes32 requestId) {
      Chainlink.Request memory request;
      request = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfillString.selector);
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

  function bytesAdapterCall(address _oracle, string memory _jobId, uint _payment,
    string memory _js, string memory _vars, string memory _cid, string memory _ref)
    public returns (bytes32 requestId) {
      Chainlink.Request memory request;
      request = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfillBytes.selector);
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

  function fulfillBool(bytes32 _requestId, bool _reply)
      public recordChainlinkFulfillment(_requestId) {
        bool_result = _reply;
        emit boolAdapterReply("Chainlink node returned a bool", _reply);
  }

  function fulfillUint(bytes32 _requestId, uint _reply)
      public recordChainlinkFulfillment(_requestId) {
        uint_result = _reply;
        emit uintAdapterReply("Chainlink node returned a uint", _reply);
  }

  function fulfillInt(bytes32 _requestId, int _reply)
      public recordChainlinkFulfillment(_requestId) {
        int_result = _reply;
        emit intAdapterReply("Chainlink node returned an int", _reply);
  }

  function fulfillBytes32(bytes32 _requestId, bytes32 _reply)
      public recordChainlinkFulfillment(_requestId) {
        bytes32_result = _reply;
        emit bytes32AdapterReply("Chainlink node returned bytes32", _reply);
  }

  function fulfillString(bytes32 _requestId, string calldata _reply)
      public recordChainlinkFulfillment(_requestId) {
        string_result = _reply;
        emit stringAdapterReply("Chainlink node returned a string", _reply);
  }

  function fulfillBytes(bytes32 _requestId, bytes calldata _reply)
      public recordChainlinkFulfillment(_requestId) {
        bytes_result = _reply;
        emit bytesAdapterReply("Chainlink node returned bytes", _reply);
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
