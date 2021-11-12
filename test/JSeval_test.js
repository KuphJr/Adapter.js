const axios = require('axios');

(async function test() {
    console.log("### Test toUpperCase ###");
    await axios.post("http://localhost:8080/", {
            "id": 1,
            "data": {
            "returnType": "bytes32",
            "method": "get",
            "javascript": "return response.data.split(/\<h1>/g)[1].slice(0,32);",
            "url": "https://www.york.ac.uk/teaching/cws/wws/webpage1.html"
            }
        })
    .then(response => console.log(response.data))
    .catch(error => console.log(error.response.data.error.message));
})();

// (async function test() {
//     console.log("### Test 2 ###");
//     await axios.get("https://www.york.ac.uk/teaching/cws/wws/webpage1.html")
//     .then(response => console.log(response.data.split(/<(.*)>/ig)[1].slice(0,32)))
//     .catch(error => console.log(error.response.data.error.message));
// })();

