const fs = require('fs')
const path = require('path')
const CryptoJS = require('crypto-js')
const prompt = require('prompt')

prompt.start()

const properties = [{
  name: 'nodeKey',
  validator: /^[a-zA-Z0-9]+$/,
  message: 'Enter nodeKey',
  warning: 'nodeKey must be only letters and numbers',
  hidden: true
}]

prompt.get(properties, function (err, result) {
  fs.writeFileSync(
    path.join(__dirname, '..', 'keyhash.enc'),
    CryptoJS.SHA256(result.nodeKey).toString()
  )
})