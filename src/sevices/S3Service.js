import AWS from 'aws-sdk';
import path from 'path';
import crypto from 'crypto';

const s3 = new AWS.S3();


const generateHash = (string) => {
  return crypto.createHmac("sha256", string)
    .update('someString')
    .digest("hex");
};


export const upload = async (file) => {
  const fileConfig = {
    Bucket: 'owleks-delivery-app',
    ACL: 'public-read',
    Body: file.buffer,
    Key: 'uploads/' + generateHash(Date.now().toString()) + path.extname(file.originalname)
  };

  return await s3.upload(fileConfig).promise();
};