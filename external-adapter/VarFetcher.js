const fs = require('fs')
const { Storage } = require('@google-cloud/storage')

class VarFetcher {
  static async fetchCachedVariables (contractAddress, ref) {
    const filename = contractAddress + ref + '.json'
    if (filename.length > 256) {
      throw Error('File name is too long')
    }
    const storage = new Storage({ keyFilename: 'key.json' })
    const destFilename = '/tmp/vars.json'
    const bucketname = 'cached_vars'
    await storage.bucket(bucketname).file(filename).download({ destination: destFilename })
    return JSON.parse(fs.readFileSync('/tmp/vars.json'))
  }
}

module.exports.VarFetcher = VarFetcher
