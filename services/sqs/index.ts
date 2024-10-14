const {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} = require('@aws-sdk/client-sqs');

export const sqsClient = new SQSClient({
  region: 'us-east-1',
});
