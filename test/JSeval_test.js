const axios = require('axios');

(async function test() {
    console.log("### Test toUpperCase ###");
    await axios.post("http://localhost:8080/", {
            "id": 1,
            "data": {
            "returnType": "string",
            "method": "get",
            "javascript": "return response.data.title;",
            "url": "https://jsonplaceholder.typicode.com/posts/1"
            }
        })
    .then(response => console.log(response.data.result))
    .catch(error => console.log(error.response.data.error.message));
})();

