const CryptoJS = require('crypto-js');
const fs = require('fs');
const path = require('path')
const process = require('process');

class DataStorage {
  constructor() {
    this.dirPath ? process.env.DIR : '../encryptedCachedData'
    if (!fs.existsSync(this.dirPath)) {
      if (this.dirPath == '../encryptedCachedData') {
        fs.mkdirSync(this.dirPath)
      } else {
        throw Error("Invalid storage directory")
      }
    }
    if (!process.env.KEY) {
      throw Error('Environmental variable "KEY" has not been set. ' +
      'Run again with command "KEY=<ENCRYPTION_KEY_HERE> <start command>"')
    }
    this.key = process.env.KEY
  }

  async storeData(input) {
    var encrypted = CryptoJS.AES.encrypt(JSON.stringify(input), input.contractAddress + input.ref + this.key)
    const filename = CryptoJS.SHA256(input.contractAddress + input.ref).toString() + '.enc'
    const filepath = path.join(this.dirPath, filename)
    fs.writeFileSync(filepath, encrypted.toString());
  }

  async retrieveData(input) {
    const filename = CryptoJS.SHA256(input.contractAddress + input.ref).toString() + '.enc'
    const filepath = path.join(this.dirPath, filename)
    const file = fs.readFileSync(filepath)
    const decrypted = CryptoJS.AES.decrypt(file.toString(), input.contractAddress + input.ref + this.key);
    const utf8 = CryptoJS.enc.Utf8.stringify(decrypted)
    return utf8
  }
}

module.exports.DataStorage = DataStorage
