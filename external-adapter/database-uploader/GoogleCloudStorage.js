const { Storage } = require('@google-cloud/storage');
const CryptoJS = require('crypto-js')

class DataStorage {
    constructor(bucketName = 'adapterjs-database') {
        this.storage = new Storage({ keyFilename: 'key.json' })
        this.bucket = this.storage.bucket(bucketName)
    }

    async storeData(input) {
        const filename = input.contractAddress + input.ref + '.json'
        const file = this.bucket.file(filename)
        const fileExists = await file.exists()
        if (fileExists[0]) {
            throw new Error(
                `Reference ID ${input.ref} is already in use for contract ${input.contractAddress}.`)
        }
        const objectString = JSON.stringify(input)
        await file.save(objectString)
    }
}

module.exports.DataStorage = DataStorage
