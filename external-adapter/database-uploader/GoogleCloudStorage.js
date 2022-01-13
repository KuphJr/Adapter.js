const { Storage } = require('@google-cloud/storage');

class DataStorage {
    constructor(bucketName = 'cached-data') {
        this.storage = new Storage({ keyFilename: 'key.json' })
        this.bucket = this.storage.bucket(bucketName)
    }

    async uploadData(input) {
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
