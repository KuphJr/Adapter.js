//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract AdapterJS is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    address public chainlinkNode;
    uint256 public fee;

    bytes32 public int256JobId;
    bytes32 public uint256JobId;
    bytes32 public boolJobId;
    bytes32 public bytes32JobId;

    constructor(address _chainlinkNode, bytes32 _int256JobId,
        bytes32 _uint256JobId, bytes32 _boolJobId,
        bytes32 _bytes32JobId, uint256 _fee) {
            setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
            chainlinkNode = _chainlinkNode;
            int256JobId = _int256JobId;
            uint256JobId = _uint256JobId;
            boolJobId = _boolJobId;
            bytes32JobId = _bytes32JobId;
            fee = _fee;
    }

    event int256AdapterReply(int256 reply);
    event uint256AdapterReply(uint256 reply);
    event boolAdapterReply(bool reply);
    event bytes32AdapterReply(bytes32 reply);

    function callAdapter(
        uint8 _returnType, bytes32 _method,
        string calldata _url, string calldata _headers,
        string calldata _data, string calldata _javascript,
        string calldata _ipfsHash) public returns (bytes32 requestId) {
            Chainlink.Request memory request;
            if (_returnType == 1) {
                request = buildChainlinkRequest(
                    int256JobId, address(this), this.int256Fullfill.selector);
            } else if (_returnType == 2) {
                request = buildChainlinkRequest(
                    uint256JobId, address(this), this.uint256Fullfill.selector);
            } else if (_returnType == 3) {
                request = buildChainlinkRequest(
                    boolJobId, address(this), this.boolFullfill.selector);
            } else if (_returnType == 4) {
                request = buildChainlinkRequest(
                    bytes32JobId, address(this), this.bytes32Fullfill.selector);
            }
            if (_method != 0) {
                request.add("method", bytes32ToString(_method));
                request.add("url", _url);
                if (bytes(_headers).length != 0) {
                    request.add("headers", _headers);
                }
                if (bytes(_data).length != 0) {
                    request.add("data", _data);
                } 
            }
            if (bytes(_javascript).length != 0) {
                request.add("javascript", _javascript);
            }
            if (bytes(_ipfsHash).length != 0) {
                request.add("ipfsHash", _ipfsHash);
            }
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
