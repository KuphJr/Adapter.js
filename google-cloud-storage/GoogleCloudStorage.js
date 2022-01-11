const { Storage } = require('@google-cloud/storage');
const fs = require('fs');

class VarStorage {
    constructor(bucketName = 'private-vars') {
        this.storage = new Storage({ keyFilename: 'key.json' })
        this.bucket = this.storage.bucket(bucketName)
    }

    async uploadVars(vars, contractAddress, referenceId) {
        const filename = contractAddress + referenceId + '.json'
        const file = this.bucket.file(filename)
        const fileExists = await file.exists()
        if (fileExists[0]) {
            throw new Error(`Reference ID ${referenceId} is already in use.`)
        }
        const varsString = JSON.stringify(vars)
        file.save(varsString)
    }
}

module.exports.VarStorage = VarStorage
