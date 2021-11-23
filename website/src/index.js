import { Web3Storage } from 'web3.storage';

let externalAdapterParamString = "";

document.getElementById('method').addEventListener('change', function() {
    externalAdapterParamString = ""
    console.log('You selected: ', this.value);
    if (this.value === "none") {
        document.getElementById("urlDiv").style.display = "none";
        document.getElementById("headersDiv").style.display = "none";
        document.getElementById('url').value = "";
        document.getElementById('headers').value = "";
    } else {
        document.getElementById("urlDiv").style.display = "block";
        document.getElementById("headersDiv").style.display = "block";
    }
    if (this.value === "post" || this.value === "put" || this.value === "delete" || this.value === "trace" ||
        this.value === "patch" || this.value === "head" || this.value === "options") {
      document.getElementById("post-data").style.display = "block";
    } else {
      document.getElementById("post-data").style.display = "none";
      document.getElementById('data').value = "";
    }
});

document.getElementById('codeSource').addEventListener('change', function() {
    externalAdapterParamString = ""
    console.log('You selected: ', this.value);
    if (this.value === "ipfs") {
        document.getElementById("ipfsHashDiv").style.visibility = "visible";
        document.getElementById("codeDiv").style.display = "none";
        document.getElementById("uploadDiv").style.display = "block";
        document.getElementById('javascript').value = "";
    } else {
        document.getElementById("ipfsHashDiv").style.visibility = "hidden";
        document.getElementById("uploadDiv").style.display = "none";
        document.getElementById("codeDiv").style.display = "block";
        document.getElementById('ipfsHash').value = "";
        document.getElementById('ipfsToken').value = "";
    }
});

document.getElementById('upload').addEventListener('click', ipfsUpload);

function ipfsUpload(e) {
    externalAdapterParamString = ""
    e.preventDefault();
    if (document.getElementById('ipfsToken').value === "") {
        alert("Please enter a valid Web3.Storage API token");
        return;
    }
    const client = new web3_storage__WEBPACK_IMPORTED_MODULE_0__/* .Web3Storage */ .xk({ token: document.getElementById('ipfsToken').value });
    const fileInput = document.getElementById('fileUpload').value;
    console.log("fileInput: ", fileInput);
    const fileInputq = document.querySelector('input[type="file"]');
    console.log("fileInputq: ", fileInputq);
    // Pack files into a CAR and send to web3.storage
    console.log("got to upload");
    client.put(fileInputq.files, {
        name: 'adapterjsUploadTime' + Date.now + '.js',
        maxRetries: 3
    }).then(cidHash => {
        document.getElementById('result').value = "Successfully uploaded file to IPFS";
        document.getElementById('ipfsHash').value = cidHash;
    }).catch(err => {
        document.getElementById('result').value = "Error uploading file to IPFS: " + err;
    });
};

document.getElementById('returnType').addEventListener('change', function() {
  externalAdapterParamString = "";
});

document.getElementById('generate').addEventListener('click', generateCode);

function generateCode() {
  if (externalAdapterParamString === "") {
    alert("Please click 'Send Request' to test before generating Solidity code");
    return;
  }

  let data = { t: document.getElementById("returnType").value };
  if (document.getElementById('method').value !== "none") {
    if (document.getElementById('url').value === "") {
      alert("Please enter a valid URL");
      return;
    }
    data.m = document.getElementById('method').value;
    data.u = document.getElementById('url').value;
  }
  if (document.getElementById('data').value !== "") {
    try {
      eval("data.d = " + document.getElementById('data').value +";");
    } catch {
      alert("Error evaluting data");
      return;
    }
  }
  if (document.getElementById('uploadHeadersSelector').value === 'upload') {
    if (document.getElementById('referenceId').value === "") {
      alert("Please enter a valid reference ID");
      return;
    }
    data.r = document.getElementById('referenceId').value;
  } else if (document.getElementById('headers').value !== "") {
    try {
      eval("data.h = " + document.getElementById('headers').value +";");
    } catch {
      alert("Error evalutating headers");
      return;
    }
  }
  if (document.getElementById('codeSource').value === 'ipfs') {
      if (document.getElementById('ipfsHash').value === "") {
        alert("Please enter a valid IPFS content ID");
        return;
      }
      data.i = document.getElementById('ipfsHash').value;
  } else {
      if (document.getElementById('javascript').value === "") {
        alert("Please enter valid JavaScript code");
        return;
      }
      data.j = document.getElementById('javascript').value;
  }
  externalAdapterParamString = JSON.stringify(data);

  let returnType = document.getElementById('returnType').value;
  let jobId = "";
  switch(returnType) {
    case 'int256':
      jobId = "9d8c783d0b9645958697b880fd823137";
      break;
    case 'uint256':
      jobId = "fe689d575d904580b454415399713c01";
      break;
    case 'bool':
      jobId = "84a2d337e80c4f61bab7aff465666adc";
      break;
    case 'bytes32':
      jobId = "1302aee4e8604b36830c801e613d8082";
      break;
    default:
      alert("Invalid return type");
  }
  let network = document.getElementById('network').value;
  console.log(network);
  let oracleAddress = "";
  let linkTokenAddress= "";
  switch(network) {
    case 'mumbai':
      oracleAddress = "0xa8E22A742d39b13D54df6A912FCC7b8E71dFAFE0";
      linkTokenAddress = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
      break;
    default:
      alert("Invalid network");
  }
  let generatedCode =
`// Install and import the @chainlink/contracts NPM package.
// ie: 'import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol"'
// Inherit from ChainlinkClient when the contract is defined.
// ie: 'contract CONTRACT_NAME_HERE is ChainlinkClient {'
// Paste the code below into the constructor of the contract.
setChainlinkToken(address(${linkTokenAddress}));
// Then copy and paste the code below into the contract body.
using Chainlink for Chainlink.Request;
function request() public returns (bytes32 requestId) {
  Chainlink.Request memory ea_request = buildChainlinkRequest(
    '${jobId}', address(this), this.fulfill.selector);
  ea_request.add('p',
    ${JSON.stringify(externalAdapterParamString)}
  );
  return sendChainlinkRequestTo(
    address(${oracleAddress}),
    ea_request, 1000000000000000000);
}
function fulfill(bytes32 _requestId, ${returnType} _reply)
  public recordChainlinkFulfillment(_requestId) {
    // add code here that uses the _reply from the external adapter
}`;
  document.getElementById('code').value = generatedCode;
}

document.getElementById('javascript').addEventListener('change', function() {
  externalAdapterParamString = "";
});

document.getElementById('send').addEventListener('click', sendRequest);

document.getElementById('url').addEventListener('change', function() {
  externalAdapterParamString = "";
});

document.getElementById('headers').addEventListener('change', function() {
  externalAdapterParamString = "";
});

document.getElementById('data').addEventListener('change', function() {
  externalAdapterParamString = "";
});

document.getElementById('ipfsHash').addEventListener('change', function() {
  externalAdapterParamString = "";
});

document.getElementById('uploadHeadersSelector').addEventListener('change', function() {
  externalAdapterParamString = "";
  if (document.getElementById('uploadHeadersSelector').value === "upload") {
    console.log(document.getElementById('uploadHeadersSelector'));
    document.getElementById('uploadHeaders').style.display = 'block';
  } else {
    document.getElementById('uploadHeaders').style.display = 'none';
  }
});

document.getElementById('uploadHeadersBtn').addEventListener('click', function() {
  console.log("clicked uploadHeaders");
  if (document.getElementById('headers').value === "") {
    alert("Please enter valid headers");
    return;
  }
  if (document.getElementById('contractAddress').value === "") {
    alert("Please enter the address of the contract which is authorized to use the uploaded headers");
    return;
  }
  if (document.getElementById('referenceId').value === "") {
    alert("Please enter a valid reference ID for the uploaded headers");
    return;
  }
  let headerToUpload = "";
  try {
    eval("headerToUpload = " + document.getElementById('headers').value +";");
  } catch {
    alert("Error evalutating headers");
    return;
  }
  let url = "https://us-central1-textparserexternaladapter.cloudfunctions.net/saveAPIkey"
  //let url = "http://localhost:8080/";
  fetch(url, {
      method: 'post',
      headers: { 'Accept': 'application/json',"Content-Type": "application/json" },
      body: JSON.stringify({ "authContractAddr": document.getElementById('contractAddress').value,
      "authKey": document.getElementById('referenceId').value,
      "headers": headerToUpload  
    }),
  })
  .then(reply => reply.json())
  .then(reply => {
    console.log(reply);
    document.getElementById('result').value = reply.message;
  })
  .catch(err => alert(err));
});

function sendRequest() {
  try {
    let data = { t: document.getElementById("returnType").value };
    if (document.getElementById('method').value !== "none") {
      if (document.getElementById('url').value === "") {
        alert("Please enter a valid URL");
        return;
      }
      data.m = document.getElementById('method').value;
      data.u = document.getElementById('url').value;
    }
    if (document.getElementById('data').value !== "") {
      try {
        eval("data.d = " + document.getElementById('data').value +";");
      } catch {
        alert("Error evaluting data");
        return;
      }
    }
    if (document.getElementById('headers').value !== "") {
      try {
        eval("data.h = " + document.getElementById('headers').value +";");
      } catch {
        alert("Error evalutating headers");
        return;
      }
    }
    if (document.getElementById('codeSource').value === 'ipfs') {
        if (document.getElementById('ipfsHash').value === "") {
          alert("Please enter a valid IPFS content ID");
          return;
        }
        data.i = document.getElementById('ipfsHash').value;
    } else {
        if (document.getElementById('javascript').value === "") {
          alert("Please enter valid JavaScript code");
          return;
        }
        data.j = document.getElementById('javascript').value;
    }
    externalAdapterParamString = JSON.stringify(data);
    console.log("externalAdapterParamString: ", externalAdapterParamString);
    console.log("fetchObject: ", {
        method: 'post',
        headers: { 'Accept': 'application/json',"Content-Type": "application/json" },
        body: JSON.stringify({ "id": 999, "data": {"p": externalAdapterParamString }}),
    });
    //let url = "http://localhost:8080/";
    let url = "https://us-central1-textparserexternaladapter.cloudfunctions.net/gcpservice"
    fetch(url, {
        method: 'post',
        headers: { 'Accept': 'application/json',"Content-Type": "application/json" },
        body: JSON.stringify({ "id": 999, "data": {"p": externalAdapterParamString }}),
    })
    .then(reply => reply.json())
    .then(response => {
        try {
            console.log("Got response from URL: ", url);
            console.log("RESPONSE: ", JSON.stringify(response));
            if (typeof response.error !== 'undefined') {
              document.getElementById('result').value = response.error.name + ":" + response.error.message;
              return;
            }
            document.getElementById('result').value = response.result;
        } catch (e) {
            try {
                document.getElementById('result').value = response.error.name + ":" + response.error.message;
            } catch (e2) {
                throw e2;
            }
        }
    })
    .catch(e => {
        document.getElementById('result').value = e;
        console.log("error reported", e);
    });
  } catch (e) {
    document.getElementById('result').value = e;
    console.log("Caught: ", e)
  }
};