const axios = require('axios');

(async function test() {
    console.log("### Test toUpperCase ###");
    await axios.post("http://localhost:8080/", {
            "id": 1,
            "data": '{ "method": "get", "url": "http://127.0.0.1:5500/testjson.json", "methods": ["path(data.message)","toUpperCase()"] }'
        })
    .then(response => console.log((JSON.stringify(response.data.result) === JSON.stringify([ 'THIS IS SOME TEXT' ])) ? "PASS" : "FAIL result: " + response.data.result));
    
    console.log("### Test toLowerCase ###");
    await axios.post("http://localhost:8080/", {
            "id": 0,
            "data": '{ "method": "get", "url": "http://127.0.0.1:5500/testjson.json", "methods": ["path(data.message)","toLowerCase()"] }'
        })
    .then(response => console.log((JSON.stringify(response.data.result) === JSON.stringify([ 'this is some text' ])) ? "PASS" : "FAIL result: " + response.data.result));

    console.log("### Test split(',') and POST ###");
    await axios.post("http://localhost:8080/", {
            "id": 0,
            "data": '{"method": "post", "url": "https://jsonplaceholder.typicode.com/posts", "data": ' + JSON.stringify({message: "this,is,splitable,text"})+', "methods": ["path(message)","split(\',\')"]}'
        }).then(response => console.log((JSON.stringify(response.data.result)) === JSON.stringify([ 'this', 'is', 'splitable', 'text' ]) ? "PASS" : "FAIL result: " + response.data.result));

    console.log("### Test split(\",\") ###");
    await axios.post("http://localhost:8080/", { "id": 0,
    "data": "{ \"method\": \"get\", \"url\": \"http://127.0.0.1:5500/testjson.json\", \"methods\": [\"path(data.splitable-text-2)\",\"split(\" abc \")\"] }"
    }).then(response => console.log((JSON.stringify(response.data.result) === JSON.stringify([ 'this', 'is', 'splitable', 'text ABC here' ])) ? "PASS" : "FAIL result: " + response.data.result));

    console.log("### Test split(\",\")[2] ###");
    await axios.post("http://localhost:8080/", '{ "id": 0, "data": { "method": "get", "url": "http://127.0.0.1:5500/testjson.json", "methods": ["path(data.splitable-text-2)",\'split(" abc ")[2]\'] }}')
    .then(response => console.log((JSON.stringify(response.data.result) === JSON.stringify([ 'splitable' ])) ? "PASS" : "FAIL result: " + response.data.result));


    console.log("### Test split(/ abc /) ###");
    await axios.post("http://localhost:8080/", {"id": 0, "data": { "method": "get", "url": "http://127.0.0.1:5500/testjson.json", "methods": ["path(data.splitable-text-2)",'split(/ abc /i)']}})
    .then(response => console.log((JSON.stringify(response.data.result) === JSON.stringify([ 'this', 'is', 'splitable', 'text', 'here' ])) ? "PASS" : "FAIL result: " + response.data.result));
    
    console.log("### Test slice(0, 18) ###");
    await axios.post("http://localhost:8080/", {
            "id": 0,
            "data": {
                "method": "get",
                "url": "http://127.0.0.1:5500/index.html",
                "headers": {},
                "params": {},
                "data": {},
                "methods": ["slice(0, 18)"]
            }
        })
        //.then(response => console.log(response.data.result));
    .then(response => console.log((JSON.stringify(response.data.result) === JSON.stringify(["<!DOCTYPE html>\r\n<"])) ? "PASS" : "FAIL result: " + response.data.result + " expected " + "<!DOCTYPE html>\n<"));

    console.log("### Test match(\'text\') ###");
    await axios.post("http://localhost:8080/", {
            "id": 0,
            "data": {
                "method": "get",
                "url": "http://127.0.0.1:5500/testjson.json",
                "headers": {},
                "params": {},
                "data": {},
                "methods": ["path(data.message)", "match(\"text\")"]
            }
        })
        //.then(response => console.log(response.data.result));
    .then(response => console.log((JSON.stringify(response.data.result) === JSON.stringify(["text"])) ? "PASS" : "FAIL result: " + JSON.stringify(response.data.result) + " expected " + "[ \"text\" ]"));

    console.log("### Test match(\"test\") ###");
    await axios.post("http://localhost:8080/", {
            "id": 0,
            "data": {
                "method": "get",
                "url": "http://127.0.0.1:5500/index.html",
                "headers": {},
                "params": {},
                "data": {},
                "methods": ["match(\"test\")"]
            }
        })
        //.then(response => console.log(response.data.result));
    .then(response => console.log((JSON.stringify(response.data.result) === JSON.stringify(["test"])) ? "PASS" : "FAIL result: " + JSON.stringify(response.data.result) + " expected " + "[ \"test\" ]"));

    console.log("### Test match(/\\[(.*?)\\]/g) ###");
    let rawstring = String.raw`match(/\[(.*?)\]/g)`;
    await axios.post("http://localhost:8080/", {
            "id": 0,
            "data": {
                "method": "get",
                "url": "http://127.0.0.1:5500/index.html",
                "headers": {},
                "params": {},
                "data": {},
                "methods": [rawstring]
            }
        })
        //.then(response => console.log(response.data.result));
    .then(response => console.log((JSON.stringify(response.data.result) === JSON.stringify(["[test]", "[]", "[0]", "[i]"])) ? "PASS" : "FAIL result: " + JSON.stringify(response.data.result) + " expected " + '["[test]", "[]", "[0]", "[i]"]'));

    console.log("### Test match(/\\[(.*?)\\]/g)[2] ###");
    let rawstring2 = String.raw`match(/\[(.*?)\]/g)[2]`;
    await axios.post("http://localhost:8080/", {
            "id": 0,
            "data": {
                "method": "get",
                "url": "http://127.0.0.1:5500/index.html",
                "headers": {},
                "params": {},
                "data": {},
                "methods": [rawstring2]
            }
        })
        //.then(response => console.log(response.data.result));
    .then(response => console.log((JSON.stringify(response.data.result) === JSON.stringify(["[0]"])) ? "PASS" : "FAIL result: " + JSON.stringify(response.data.result) + " expected " + "[ \"test\" ]"));

    console.log("### Test search(\"!\") ###");
    await axios.post("http://localhost:8080/", {
            "id": 0,
            "data": {
                "method": "get",
                "url": "http://127.0.0.1:5500/index.html",
                "headers": {},
                "params": {},
                "data": {},
                "methods": ["search(\"!\")"]
            }
        })
        //.then(response => console.log(response.data.result));
    .then(response => console.log((JSON.stringify(response.data.result) === JSON.stringify(["1"])) ? "PASS" : "FAIL result: " + response.data.result + " expected " + "[ \"1\" ]"));

    console.log("### Test search(\'text\') ###");
    await axios.post("http://localhost:8080/", {
            "id": 0,
            "data": {
                "method": "get",
                "url": "http://127.0.0.1:5500/testjson.json",
                "headers": {},
                "params": {},
                "data": {},
                "methods": ["path(data.message)", "search(\"text\")"]
            }
        })
        //.then(response => console.log(response.data.result));
    .then(response => console.log((JSON.stringify(response.data.result) === JSON.stringify(["13"])) ? "PASS" : "FAIL result: " + JSON.stringify(response.data.result) + " expected " + "[ \"13\" ]"));

    console.log("### Test search(\'test\') ###");
    await axios.post("http://localhost:8080/", {
            "id": 0,
            "data": {
                "method": "get",
                "url": "http://127.0.0.1:5500/index.html",
                "headers": {},
                "params": {},
                "data": {},
                "methods": ["search(\"test\")"]
            }
        })
        //.then(response => console.log(response.data.result));
    .then(response => console.log((JSON.stringify(response.data.result) === JSON.stringify(["261"])) ? "PASS" : "FAIL result: " + JSON.stringify(response.data.result) + " expected " + "[ \"261\" ]"));


    console.log("### Test search(\"IDONOTEXIST\") ###");
    await axios.post("http://localhost:8080/", {
            "id": 0,
            "data": {
                "method": "get",
                "url": "http://127.0.0.1:5500/index.html",
                "headers": {},
                "params": {},
                "data": {},
                "methods": ["search(\"IDONOTEXIST\")"]
            }
        })
        //.then(response => console.log(response.data.result));
    .then(response => console.log((JSON.stringify(response.data.result) === JSON.stringify(["-1"])) ? "PASS" : "FAIL result: " + JSON.stringify(response.data.result) + " expected " + "[ \"-1\" ]"));

    console.log("### Test search(/\\[(.*?)\\]/g) ###");
    let rawstring4 = String.raw`search(/\[(.*?)\]/g)`;
    await axios.post("http://localhost:8080/", {
            "id": 0,
            "data": {
                "method": "get",
                "url": "http://127.0.0.1:5500/index.html",
                "headers": {},
                "params": {},
                "data": {},
                "methods": [rawstring4]
            }
        })
        //.then(response => console.log(response.data.result));
    .then(response => console.log((JSON.stringify(response.data.result) === JSON.stringify(["260"])) ? "PASS" : "FAIL result: " + JSON.stringify(response.data.result) + " expected " + '["260"]'));
    let rawstring6 = String.raw`replace(/./g, "")`;
    let rawstring5 = String.raw`replace(/\n/g, "")`;
    let rawstring7 = String.raw`replace(/\r/g, "")`;
    console.log("### Test replace(/*/g, \"\") ###");
    await axios.post("http://localhost:8080/", {
            "id": 0,
            "data": {
                "method": "get",
                "url": "http://127.0.0.1:5500/index.html",
                "headers": {},
                "params": {},
                "data": {},
                "methods": [rawstring6, rawstring5, rawstring7]
            }
        })
        //.then(response => console.log(response.data.result));
    .then(response => console.log((JSON.stringify(response.data.result) === JSON.stringify([""])) ? "PASS" : "FAIL result: " + JSON.stringify(response.data.result) + " expected " + '[""]'));

    console.log("### Test replace(/./g, \"\"), replace(/\\n/g, \"\"), replace(/\\r/g, \"\") ###");
    await axios.post("http://localhost:8080/", {
            "id": 0,
            "data": {
                "method": "get",
                "url": "http://127.0.0.1:5500/index.html",
                "headers": {},
                "params": {},
                "data": {},
                "methods": ["replace(/./g, \"\")", "replace(/\\n/g, \"\")", "replace(/\\r/g, \"\")"]
            }
        })
        //.then(response => console.log(response.data.result));
    .then(response => console.log((JSON.stringify(response.data.result) === JSON.stringify([""])) ? "PASS" : "FAIL result: " + JSON.stringify(response.data.result) + " expected " + '[""]'));

    console.log("### Test replace(\"t\", \"\") ###");
    await axios.post("http://localhost:8080/", {
            "id": 0,
            "data": {
                "method": "get",
                "url": "http://127.0.0.1:5500/testjson.json",
                "headers": {},
                "params": {},
                "data": {},
                "methods": ["path(data.message)", "replace(\"t\", \"\")"]
            }
        })
        //.then(response => console.log(response.data.result));
    .then(response => console.log((JSON.stringify(response.data.result) === JSON.stringify(["his is some text"])) ? "PASS" : "FAIL result: " + JSON.stringify(response.data.result) + " expected " + '["his is some text"]'));

    console.log("### Test replace(\'t\', \'\') ###");
    await axios.post("http://localhost:8080/", {
            "id": 0,
            "data": {
                "method": "get",
                "url": "http://127.0.0.1:5500/testjson.json",
                "headers": {},
                "params": {},
                "data": {},
                "methods": ["path(data.message)", "replace(\'t\', \'\')"]
            }
        })
        //.then(response => console.log(response.data.result));
    .then(response => console.log((JSON.stringify(response.data.result) === JSON.stringify(["his is some text"])) ? "PASS" : "FAIL result: " + JSON.stringify(response.data.result) + " expected " + '["his is some text"]'));

    console.log("### Test \"50\".multiply(10) ###");
    await axios.post("http://localhost:8080/", {
            "id": 0,
            "data": {
                "method": "get",
                "url": "http://127.0.0.1:5500/testjson.json",
                "headers": {},
                "params": {},
                "data": {},
                "methods": ["path(data.number)", "multiply(10)"]
            }
        })
        //.then(response => console.log(response.data.result));
    .then(response => console.log((JSON.stringify(response.data.result) === JSON.stringify(["500"])) ? "PASS" : "FAIL result: " + JSON.stringify(response.data.result) + " expected " + '["500"]'));  

    console.log("### Test message.multiply(10) ###");
    await axios.post("http://localhost:8080/", {
            "id": 0,
            "data": {
                "method": "get",
                "url": "http://127.0.0.1:5500/testjson.json",
                "headers": {},
                "params": {},
                "data": {},
                "methods": ["path(data.message)", "multiply(10)"]
            }
        })
        //.then(response => console.log(response.data.result));
    .then(response => console.log((JSON.stringify(response.data.result) === JSON.stringify(["NaN"])) ? "PASS" : "FAIL result: " + JSON.stringify(response.data.result) + " expected " + '["NaN"]'));  

    console.log("### Test split(','), search('s') ###");
    await axios.post("http://localhost:8080/", {
            "id": 0,
            "data": {
                "method": "get",
                "url": "http://127.0.0.1:5500/testjson.json",
                "headers": {},
                "params": {},
                "data": {},
                "methods": ["path(data.splitable-text-1)", "split(',')[1]", "search('s')"]
            }
        })
        //.then(response => console.log(response.data.result));
    .then(response => console.log((JSON.stringify(response.data.result) === JSON.stringify(["1"])) ? "PASS" : "FAIL result: " + JSON.stringify(response.data.result) + " expected " + '["1"]'));  

    console.log("### Test match('s'), search('s'), multiply(10) ###");
    await axios.post("http://localhost:8080/", {
            "id": 0,
            "data": {
                "method": "get",
                "url": "http://127.0.0.1:5500/testjson.json",
                "headers": {},
                "params": {},
                "data": {},
                "methods": ["path(data.splitable-text-1)", "match(/this/g)[0]", "search(\"s\")", "multiply(10)"]
            }
        })
        //.then(response => console.log(response.data.result));
    .then(response => console.log((JSON.stringify(response.data.result) === JSON.stringify(["30"])) ? "PASS" : "FAIL result: " + JSON.stringify(response.data.result) + " expected " + '["30"]'));

    console.log("### Test slice(200, 270), search(/test/) ###");
    await axios.post("http://localhost:8080/", {
            "id": 0,
            "data": {
                "method": "get",
                "url": "http://127.0.0.1:5500/index.html",
                "headers": {},
                "params": {},
                "data": {},
                "methods": ["slice(200, 270)", "search(/test/)"]
            }
        })
        //.then(response => console.log(response.data.result));
    .then(response => console.log((JSON.stringify(response.data.result) === JSON.stringify(["61"])) ? "PASS" : "FAIL result: " + JSON.stringify(response.data.result) + " expected " + '["61"]'));
})();