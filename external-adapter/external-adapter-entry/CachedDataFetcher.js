const fs = require('fs')
const os = require('os')
const path = require('path')
const { Storage } = require('@google-cloud/storage')

class CachedDataFetcher {
  static async fetchCachedData (contractAddress, ref) {
    const tempFilename = path.join(os.tmpdir(), 'data.json')
    const filename = contractAddress.toLowerCase() + ref + '.json'
    for (const char in filename) {
      if ((char < '0' || char > '9') && (char < 'a' || char > 'z') && (char < 'A' || char > 'Z')) {
        throw new Error('The file name can only contain alphabetical characters and numbers.')
      }
    }
    if (filename.length > 74) {
      throw new Error('File name is too long')
    }
    const storage = new Storage({ keyFilename: 'key.json' })
    const bucketname = 'adapterjs-database'
    try {
      try {
        await storage.bucket(bucketname).file(filename).download({ destination: tempFilename })
      } catch (error) {
        throw new Error(`Cached data was not able to be retrieved for contract ${contractAddress} using reference ID ${ref}.`)
      }
      return JSON.parse(fs.readFileSync(tempFilename))
    } finally {
      try {
        fs.unlinkSync(tempFilename)
      } catch {}
    }
  }
}

module.exports.CachedDataFetcher = CachedDataFetcher
