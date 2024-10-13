const express = require('express');
const app = express();
require('dotenv').config();
const {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} = require('@aws-sdk/client-sqs');
const { configObject } = '/credentials.js';
const { Consumer } = require('sqs-consumer');
// move to SQS factory
const sqsClient = new SQSClient({
  region: 'us-east-1',
  // useQueueUrlAsEndpoint: false,
  // endpoint: 'https://sqs.us-east-1.amazonaws.com',

  // credentials: {
  //   accessKeyId: process.env.AWS_ACCESS_KEY,
  //   secretAccessKey: process.env.SECRET_KEY,
  // },
});

const queueUrl =
  'https://sqs.us-east-1.amazonaws.com/430118838661/JobNotificationQueue';

const deleteMessageFromQueue = async (ReceiptHandle) => {
  try {
    const data = await sqsClient.send(
      new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle,
      })
    );
  } catch (error) {
    console.log(error);
  }
};

// message to be sent
const sendMessageToQueue = async (body) => {
  try {
    const command = new SendMessageCommand({
      MessageBody: body,
      QueueUrl: queueUrl,
      MessageAttributes: {
        OrderId: { DataType: 'String', StringValue: '4421x' },
      },
    });
    console.log(command);
    const result = await sqsClient.send(command);
    console.log(result);
    // once done processing, delete the message from the queue
  } catch (error) {
    console.log(error);
  }
};

// sendMessageToQueue(
//   JSON.stringify({
//     title: 'Job created 003',
//     description: 'Do anything with this data',
//   })
// );

// consumes the
const pollMessages = async () => {
  try {
    const command = new ReceiveMessageCommand({
      MaxNumberOfMessages: 10,
      QueueUrl: process.env.AWS_QUEUE_URL,
      WaitTimeSeconds: 5,
      MessageAttributes: ['All'],
    });
    const result = await sqsClient.send(command);
    console.log(result.Messages[0]);
    // after sending to firebase, delete the message

    await deleteMessageFromQueue(result.Messages[0].ReceiptHandle);

    console.log('Message deleted', result.Messages[0].Body);
  } catch (error) {
    console.log(error);
  }
};

// pollMessages();

app.get('/api/home', (req, res) => {
  res.json({
    status: 200,
    message: 'hello world...',
  });
});

app.get('/api/away', (req, res) => {
  res.json({
    status: 200,
    message: 'Just added this',
  });
});

//process.env.PORT || 5000
app.listen(8000, () => {
  console.log(
    `server is running fine ${process.env.POSTGRES_URL} ===> ${process.env.PORT}`
  );
});

// auto deletes messages not like the manual example
const sqsConsumerApp = Consumer.create({
  queueUrl,
  sqs: sqsClient,
  handleMessage: async (message) => {
    console.log('MESSAGE FROM QUEUE', message);
  },
});

sqsConsumerApp.on('processing_error', (err) => {
  console.log(err);
});

sqsConsumerApp.start();
