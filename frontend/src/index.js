import { Web3Storage } from 'web3.storage';
document.getElementById('method').addEventListener('change', function() {
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
    e.preventDefault();
    if (document.getElementById('ipfsToken').value === "") {
        alert("Please enter a valid Web3.Storage API token");
        return;
    }
    const client = new Web3Storage({ token: document.getElementById('ipfsToken').value });
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

document.getElementById('send').addEventListener('click', sendRequest);

function sendRequest() {
    try {
        let data = { returnType: document.getElementById("returnType").value };
        if (document.getElementById('method').value !== "none") {
            data.method = document.getElementById('method').value;
            if (document.getElementById('url').value !== "") {
                data.url = document.getElementById('url').value;
            } else {
                alert("Please enter a valid URL");
            }
        }
        if (document.getElementById('data').value !== "") {
            data.data = JSON.stringify(eval(document.getElementById('data').value));
        }
        if (document.getElementById('headers').value !== "") {
            data.headers = JSON.stringify(eval(document.getElementById('headers').value));
        }
        if (document.getElementById('codeSource').value === 'ipfs') {
            if (document.getElementById('ipfsHash').value === "") {
                alert("Please enter a valid IPFS content ID");
                return;
            } else {
                data.ipfs = document.getElementById('ipfsHash').value;
            }
        } else {
            if (document.getElementById('javascript').value === "") {
                alert("Please enter valid JavaScript code");
                return;
            } else {
                data.javascript = document.getElementById('javascript').value;
            }
        }
        console.log("data: ", JSON.stringify(data));
        //console.log("json string: ", dataString);
        console.log("fetchObject: ", {
            method: 'post',
            headers: { 'Accept': 'application/json',"Content-Type": "application/json" },
            body: JSON.stringify({ "id": 999, "data": data }),
        });
        //http://localhost:8080/
        fetch('https://us-central1-textparserexternaladapter.cloudfunctions.net/gcpservice', {
            method: 'post',
            headers: { 'Accept': 'application/json',"Content-Type": "application/json" },
            body: JSON.stringify({ "id": 999, "data": data }),
        })
        .then(reply => reply.json())
        .then( response => {
            try {
                document.getElementById('result').value = response.data.result;
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