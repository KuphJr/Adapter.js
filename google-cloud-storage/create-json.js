const fs = require('fs');

let item1 = {authorization: "123"};
let arr = [];
let json = JSON.stringify(arr);

fs.writeFileSync('./jsonfiles/test.json', json, (err) => {
    if (err) {
        console.log(err);
        return;
    }
});
fs.readFile('./jsonfiles/test.json', (err, data) => {
    JSON.parse(data.toString());
});