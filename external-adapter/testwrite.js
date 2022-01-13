const fs = require('fs')

const filename = './testdata.json'
fs.writeFileSync(filename, Number(72).toString())
const data = parseInt(fs.readFileSync(filename, { encoding: 'UTF-8' }))
console.log(data)
