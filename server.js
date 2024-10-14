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
const JobNotificationQueueConsumer = require('./services/sqs/consumer');
// move to SQS factory
const sqsClient = new SQSClient({
  region: 'us-east-1',
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

const jobNotifConsumer = new JobNotificationQueueConsumer();

jobNotifConsumer.startJobNotificationQueue();
