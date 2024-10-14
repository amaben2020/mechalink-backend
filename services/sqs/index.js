const { SQSClient } = require('@aws-sdk/client-sqs');

const sqsClient = new SQSClient({
  region: 'us-east-1',
});

module.exports = sqsClient;
