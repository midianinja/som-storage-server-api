import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  signatureVersion: 'v4',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_ACCESS_KEY_ID,
});
/**
  * upload - That function upload file to aws s3
  *
  * @function upload
  * @param {string} body it's file data (binary)
  * @param {string} key it's bucket path
  * @param {string} contentType it's file content type
  * @returns {promise} with err or file storage data
  */
const upload = (body, key, contentType = null, Bucket = 'dev-som-storage') => {
  console.log('Bucket: ', Bucket);
  const params = {
    Body: body,
    Bucket,
    Key: key,
    ACL: 'public-read',
  };

  if (contentType) params.ContentType = contentType;

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

export default ({
  upload,
});
