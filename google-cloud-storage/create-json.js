const fs = require('fs');

let item1 = {authorization: "123"};
let arr = [];
let json = JSON.stringify(arr);

fs.writeFileSync('cachedHeaders.json', json, (err) => {
    if (err) {
        console.log(err);
        return;
    }
});
fs.readFile('cachedHeaders.json', (err, data) => {
    JSON.parse(data.toString());
});