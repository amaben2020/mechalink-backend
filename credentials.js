require('dotenv').config();

const configObject = {
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
};

module.exports = {
  configObject,
};
