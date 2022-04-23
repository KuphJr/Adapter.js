const Crypto = require('crypto')
const CryptoJs = require('crypto-js')

class Encryption {
  constructor(publicKey) {
    this.publicKey = publicKey
  }

  /* Encrypt returns an object of the following form:
      {
        encryptedDecryptionKey: string,
        encryptedUserDataJsonString: string
      }
    The encryptedDecryptionKey is the key to decrypt the encryptedUserDataJSON, but
    encryptedDecryptionKey is encrypted using a public RSA key and can only be decrypted
    with the matching private RSA key which should only be known by the Chainlink node.
  */
  encrypt(publicKey, validatedInput) {
    const userDataJsonString = Buffer.from(JSON.stringify(validatedInput))
    const decryptionKey = Crypto.randomBytes(64).toString()
    const encryptedDecryptionKey = Crypto.publicEncrypt(publicKey, decryptionKey).toString()
    const encryptedUserDataJsonString = CryptoJs.AES.encrypt(
      userDataJsonString,
      decryptionKey + validatedInput.contractAddress + validatedInput.ref
    )
    return {
      encryptedDecryptionKey: encryptedDecryptionKey,
      encryptedUserDataJsonString: encryptedUserDataJsonString
    }
  }

  decrypt(privateKey, contractAddress, ref, )
}