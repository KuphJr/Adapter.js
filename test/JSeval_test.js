const axios = require('axios');

(async function test() {
    console.log("### Test toUpperCase ###");
    await axios.post("https://us-central1-textparserexternaladapter.cloudfunctions.net/gcpservice", {
            "id": 1,
            "data": {
            "returnType": "uint256",
            "method": "get",
            "javascript": "let a = 2; return response.data.id + a * 1;",
            "url": "https://jsonplaceholder.typicode.com/posts/1"
            }
        })
    .then(response => console.log(response.data.result))
    .catch(error => console.log(error.response.data.error.message));
})();

