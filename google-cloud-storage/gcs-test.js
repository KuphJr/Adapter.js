// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// For more information on ways to initialize Storage, please see
// https://googleapis.dev/nodejs/storage/latest/Storage.html

// Creates a client using Application Default Credentials
//const storage = new Storage();

// Creates a client from a Google service account key
const storage = new Storage({keyFilename: 'key.json'});

/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
// The ID of your GCS bucket
const bucketName = 'cached_headers';
const fileName = 'cachedHeaders.json';
const destFileName = './download/test.json';

// async function createBucket() {
//   // Creates the new bucket
//   await storage.createBucket(bucketName);
//   console.log(`Bucket ${bucketName} created.`);
// }
//createBucket().catch(console.error);

async function uploadFile() {
    await storage.bucket(bucketName).upload(fileName, {
        destination: fileName,
    });

    console.log(`${fileName} uploaded to ${bucketName}`);
}

uploadFile().catch(console.error);

async function downloadFile() {
  const options = {
    destination: destFileName,
  };

  // Downloads the file
  await storage.bucket(bucketName).file('test.json').download(options);

  console.log(
    `gs://${bucketName}/${fileName} downloaded to ${destFileName}.`
  );
}
  
downloadFile().catch(console.error);
