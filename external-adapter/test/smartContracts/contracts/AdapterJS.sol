//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract AdapterJS is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    address public chainlinkNode;
    uint256 public fee;
    bytes32 public uninit;

    event deployed(uint256 time);

    constructor(address _chainlinkNode, uint256 _fee) {
            setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
            chainlinkNode = _chainlinkNode;
            fee = _fee;
            emit deployed(block.timestamp);
    }

    event int256AdapterReply(int256 reply);
    event uint256AdapterReply(uint256 reply);
    event boolAdapterReply(bool reply);
    event bytes32AdapterReply(bytes32 reply);

    event calledAdapter(uint256);
    event CLrequest(Chainlink.Request request);

    function simpleCallAdapter() public returns(bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(
        "b1d42cd54a3a4201b1f625a68e48aad2",
        address(this), this.simpleFulfill.selector);
        bytes32 sent = sendChainlinkRequestTo(chainlinkNode, request, fee);
        return sent;
    }

    function simpleFulfill(bytes32 _requestId, uint256 _reply) 
        public recordChainlinkFulfillment(_requestId) {
            emit uint256AdapterReply(_reply);
    }

    function int256CallAdapter(
        string memory _method,
        string memory _url, string memory _headers,
        string memory _data, string memory _javascript,
        string memory _ipfs) public returns (bytes32 requestId) {
            emit calledAdapter(8);
            Chainlink.Request memory request;
            request = buildChainlinkRequest(uninit,
                                            address(this),
                                            this.int256Fullfill.selector);
            request.add("returnType", "int256");
            request.add("method", _method);
            request.add("url", _url);
            request.add("headers", _headers);
            request.add("data", _data);
            request.add("javascript", _javascript);
            request.add("ipfs", _ipfs);
            emit CLrequest(request);
            return sendChainlinkRequestTo(chainlinkNode, request, fee);
    }

    function int256Fullfill(bytes32 _requestId, int256 _reply)
        public recordChainlinkFulfillment(_requestId) {
            emit int256AdapterReply(_reply);
    }

    function uint256Fullfill(bytes32 _requestId, uint256 _reply)
        public recordChainlinkFulfillment(_requestId) {
            emit uint256AdapterReply(_reply);
    }

    function boolFullfill(bytes32 _requestId, bool _reply)
        public recordChainlinkFulfillment(_requestId) {
            emit boolAdapterReply(_reply);
    }

    function bytes32Fullfill(bytes32 _requestId, bytes32 _reply)
        public recordChainlinkFulfillment(_requestId) {
            emit bytes32AdapterReply(_reply);
    }

    function bytes32ToString(bytes32 _bytes32)
        public pure returns (string memory) {
            uint8 i = 0;
            while(i < 32 && _bytes32[i] != 0) {
                i++;
            }
            bytes memory bytesArray = new bytes(i);
            for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
                bytesArray[i] = _bytes32[i];
            }
            return string(bytesArray);
    }
}
