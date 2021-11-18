const {Storage} = require('@google-cloud/storage');
const fs = require('fs');

const storage = new Storage({keyFilename: 'key.json'});

const saveAPIkey = async (input, callback) => {
  console.log("INPUT", JSON.stringify(input));
  let message = "";

  const bucketName = 'your-unique-bucket-name12';
  const fileName = './jsonfiles/test.json';
  const destFileName = './download/test.json';

  async function downloadFile() {
    console.log("#1 Download");
    const options = {
      destination: destFileName,
    };
  
    // Downloads the file
    await storage.bucket(bucketName).file('test.json').download(options);
  
    console.log(
      `gs://${bucketName}/${fileName} downloaded to ${destFileName}.`
    );
  }

  function addHeaderToJSON() {
    console.log("#2 Append");
    let cachedHeaders = JSON.parse(fs.readFileSync('./download/test.json').toString());
    let newCachedHeader = {
      authKey: input.authKey,
      authContractAddr: input.authContractAddr,
      headers: input.headers };
    let overwrotePrevEntry = false;
    // check if the entry already exists & if it does, overwrite it
    let i = 0;
    for (const header of cachedHeaders) {
      if (header.authContractAddr === input.authContractAddr && header.authKey === input.authKey) {
          cachedHeaders[i] = newCachedHeader;
          i++;
          console.log("overwrote previous entry");
          message = `overwrote previous entry for contract address ${input.authContractAddr} and authKey ${input.authKey}`;
          overwrotePrevEntry = true;
          break;
      }
    }
    if (!overwrotePrevEntry) {
      console.log("new entry");
      message = `created entry for contract address ${input.authContractAddr} and authKey ${input.authKey}`;
      cachedHeaders.push(newCachedHeader);
    }
    return JSON.stringify(cachedHeaders);
  }

  async function saveJSONtoFile(jsonString) {
    fs.writeFileSync('./download/test.json', jsonString, (err) => {
      if (err) {
          console.log(err);
          process.exit(1);
      }
    });
  }

  async function uploadFile() {
    fs.readFile('./download/test.json', (err, data) => {
    });
    await storage.bucket(bucketName).upload('./download/test.json', {
        destination: 'test.json',
    });

    console.log(`${fileName} uploaded to ${bucketName}`);
  }
  
  try {
    await downloadFile();
    let jsonString = addHeaderToJSON();
    await saveJSONtoFile(jsonString);
    await uploadFile();
    callback(200, { message: message });
  } catch (err) {
    console.log(err);
    callback(500, { message: err.message })
  } finally {
    fs.unlinkSync('./download/test.json');
  }
};

// export for GCP Functions
exports.saveAPIkeyGCF = (req, res) => {
  saveAPIkey(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
};

// Export for testing with express
module.exports.saveAPIkey = saveAPIkey;