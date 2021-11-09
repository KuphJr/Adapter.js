document.getElementById('method').addEventListener('change', function() {
    console.log('You selected: ', this.value);
    if (this.value === "post") {
      document.getElementById("post-data").style.visibility = "visible";
    } else {
      document.getElementById("post-data").style.visibility = "hidden";
    }
  });

document.getElementById('send').addEventListener('click', sendRequest);

function sendRequest() {
    console.log("started sendRequest()")
    try {
        let url = document.getElementById('url').value;
        let method = document.getElementById('method').value;
        let functions = JSON.stringify(document.getElementById('functions').value.split("\n").filter(f => f.length > 0));
        let data = JSON.parse(`{ "url": "${url}", "method": "${method}",  "functions": ${functions}}`);
        console.log("init data: ", data);
        if (document.getElementById('data').value !== "") {
            let postData = JSON.stringify(eval(document.getElementById('data').value));
            data.data = postData;
        }
        let headers = "{}"
        if (document.getElementById('headers').value !== "") {
            headers = JSON.stringify(eval(document.getElementById('headers').value));
            data.headers = headers;
        }
        console.log("data: ", data)
        let dataString = JSON.stringify(data);
        //console.log("json string: ", dataString);
        console.log("fetchObject: ", {
            method: 'post',
            headers: { 'Accept': 'application/json',"Content-Type": "application/json" },
            body: JSON.stringify({ "id": 0, "data": dataString }),
        });
        fetch('http://localhost:8080/', {
            method: 'post',
            headers: { 'Accept': 'application/json',"Content-Type": "application/json" },
            body: JSON.stringify({ "id": 0, "data": dataString }),
        })
        .then(reply => reply.json())
        .then( text => {
            try {
                text => document.getElementById('result').value = text.data.result;
            } catch (e) {
                try {
                    text => document.getElementById('result').value = text.error.name + ":" + text.error.message;
                } catch (e2) {
                    throw e2;
                }
            }
        })
        .catch(e => document.getElementById('result').value = e);
    } catch (e) {
      document.getElementById('result').value = e;
    }
};